// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BorderHopHook
 * @dev CCTP V2 Hook Contract for BorderHop - AI-Powered Multichain USDC Remittance Gateway
 * 
 * This contract implements Circle's CCTP V2 hooks to execute post-transfer actions:
 * - Auto-deposit to DeFi protocols for yield optimization
 * - Treasury rebalancing across chains
 * - Liquidity provision automation
 * - Fiat off-ramp notifications
 * 
 * Built for Circle Developer Bounties Hackathon 2025
 * 
 * @author BorderHop Team
 * @notice This contract is designed to work with Circle's CCTP V2 protocol
 */
contract BorderHopHook is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event HookExecuted(
        bytes32 indexed transferId,
        address indexed recipient,
        string hookType,
        string protocol,
        uint256 amount,
        bool success
    );

    event DeFiDeposit(
        address indexed user,
        string protocol,
        uint256 amount,
        uint256 estimatedAPY
    );

    event TreasuryRebalanced(
        address indexed treasury,
        string fromChain,
        string toChain,
        uint256 amount
    );

    // Structs
    struct HookConfig {
        string hookType;
        string protocol;
        uint256 minAmount;
        uint256 maxAmount;
        bool enabled;
        uint256 estimatedAPY;
    }

    struct TransferIntent {
        string intent;
        string destinationChain;
        string protocol;
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    mapping(bytes32 => TransferIntent) public transferIntents;
    mapping(string => HookConfig) public hookConfigs;
    mapping(address => bool) public authorizedExecutors;
    
    IERC20 public immutable usdc;
    address public immutable cctpTokenMessenger;
    
    uint256 public constant MIN_HOOK_AMOUNT = 0.01e6; // 0.01 USDC (6 decimals)
    uint256 public constant MAX_HOOK_AMOUNT = 1000000e6; // 1M USDC
    
    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedExecutors[msg.sender] || msg.sender == owner(), "BorderHopHook: Unauthorized");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount >= MIN_HOOK_AMOUNT, "BorderHopHook: Amount too low");
        require(amount <= MAX_HOOK_AMOUNT, "BorderHopHook: Amount too high");
        _;
    }

    /**
     * @dev Constructor - Initialize the hook contract
     * @param _usdc USDC token address for the chain
     * @param _cctpTokenMessenger CCTP TokenMessenger contract address
     */
    constructor(
        address _usdc,
        address _cctpTokenMessenger
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "BorderHopHook: Invalid USDC address");
        require(_cctpTokenMessenger != address(0), "BorderHopHook: Invalid CCTP address");
        
        usdc = IERC20(_usdc);
        cctpTokenMessenger = _cctpTokenMessenger;
        
        // Initialize default hook configurations
        _initializeDefaultHooks();
    }

    /**
     * @dev Initialize default hook configurations for different protocols
     */
    function _initializeDefaultHooks() internal {
        // DeFi Deposit Hooks
        hookConfigs["aave_deposit"] = HookConfig({
            hookType: "defi_deposit",
            protocol: "Aave",
            minAmount: 0.01e6,
            maxAmount: 1000000e6,
            enabled: true,
            estimatedAPY: 450 // 4.5% APY (basis points)
        });

        hookConfigs["compound_deposit"] = HookConfig({
            hookType: "defi_deposit",
            protocol: "Compound",
            minAmount: 0.01e6,
            maxAmount: 1000000e6,
            enabled: true,
            estimatedAPY: 380 // 3.8% APY
        });

        // Treasury Rebalancing Hooks
        hookConfigs["treasury_rebalance"] = HookConfig({
            hookType: "treasury_rebalancing",
            protocol: "BorderHop Treasury",
            minAmount: 100e6, // 100 USDC minimum
            maxAmount: 1000000e6,
            enabled: true,
            estimatedAPY: 0
        });

        // Liquidity Provision Hooks
        hookConfigs["liquidity_provision"] = HookConfig({
            hookType: "liquidity_provision",
            protocol: "Uniswap V3",
            minAmount: 50e6, // 50 USDC minimum
            maxAmount: 1000000e6,
            enabled: true,
            estimatedAPY: 1200 // 12% APY from LP fees
        });
    }

    /**
     * @dev Execute post-transfer hook based on transfer intent
     * This is the main function that gets called by CCTP V2 after minting
     * 
     * @param transferId Unique identifier for the transfer
     * @param recipient Address that received the USDC
     * @param amount Amount of USDC received
     * @param hookType Type of hook to execute
     * @param protocol Protocol to interact with
     */
    function executeHook(
        bytes32 transferId,
        address recipient,
        uint256 amount,
        string calldata hookType,
        string calldata protocol
    ) external onlyAuthorized nonReentrant validAmount(amount) {
        require(transferIntents[transferId].amount > 0, "BorderHopHook: Transfer intent not found");
        
        TransferIntent memory intent = transferIntents[transferId];
        HookConfig memory config = hookConfigs[protocol];
        
        require(config.enabled, "BorderHopHook: Hook not enabled");
        require(keccak256(bytes(intent.protocol)) == keccak256(bytes(protocol)), "BorderHopHook: Protocol mismatch");
        
        bool success = false;
        
        if (keccak256(bytes(hookType)) == keccak256(bytes("defi_deposit"))) {
            success = _executeDeFiDeposit(recipient, protocol, amount, config);
        } else if (keccak256(bytes(hookType)) == keccak256(bytes("treasury_rebalancing"))) {
            success = _executeTreasuryRebalancing(recipient, intent.destinationChain, amount);
        } else if (keccak256(bytes(hookType)) == keccak256(bytes("liquidity_provision"))) {
            success = _executeLiquidityProvision(recipient, protocol, amount, config);
        }
        
        emit HookExecuted(transferId, recipient, hookType, protocol, amount, success);
        
        // Clean up transfer intent
        delete transferIntents[transferId];
    }

    /**
     * @dev Execute DeFi deposit hook
     * @param user User address
     * @param protocol Protocol name
     * @param amount Amount to deposit
     * @param config Hook configuration
     * @return success Whether the operation succeeded
     */
    function _executeDeFiDeposit(
        address user,
        string memory protocol,
        uint256 amount,
        HookConfig memory config
    ) internal returns (bool success) {
        // For MVP, we'll simulate the deposit by transferring USDC to a mock protocol address
        // In production, this would call the actual protocol's deposit function
        
        // Mock protocol address (in real implementation, this would be the actual protocol contract)
        address mockProtocol = address(0x1234567890123456789012345678901234567890);
        
        try usdc.transfer(mockProtocol, amount) {
            emit DeFiDeposit(user, protocol, amount, config.estimatedAPY);
            success = true;
        } catch {
            success = false;
        }
        
        return success;
    }

    /**
     * @dev Execute treasury rebalancing hook
     * @param treasury Treasury address
     * @param destinationChain Target chain for rebalancing
     * @param amount Amount to rebalance
     * @return success Whether the operation succeeded
     */
    function _executeTreasuryRebalancing(
        address treasury,
        string memory destinationChain,
        uint256 amount
    ) internal returns (bool success) {
        // For MVP, we'll emit an event to signal the rebalancing
        // In production, this would trigger cross-chain operations
        
        emit TreasuryRebalanced(treasury, "current", destinationChain, amount);
        success = true;
        
        return success;
    }

    /**
     * @dev Execute liquidity provision hook
     * @param user User address
     * @param protocol Protocol name
     * @param amount Amount to provide as liquidity
     * @param config Hook configuration
     * @return success Whether the operation succeeded
     */
    function _executeLiquidityProvision(
        address user,
        string memory protocol,
        uint256 amount,
        HookConfig memory config
    ) internal returns (bool success) {
        // For MVP, we'll simulate liquidity provision
        // In production, this would call Uniswap V3 or similar DEX
        
        emit DeFiDeposit(user, protocol, amount, config.estimatedAPY);
        success = true;
        
        return success;
    }

    /**
     * @dev Register transfer intent for hook execution
     * @param transferId Unique transfer identifier
     * @param intent Transfer intent details
     */
    function registerTransferIntent(
        bytes32 transferId,
        TransferIntent calldata intent
    ) external onlyAuthorized {
        require(transferIntents[transferId].amount == 0, "BorderHopHook: Intent already registered");
        require(intent.amount > 0, "BorderHopHook: Invalid amount");
        
        transferIntents[transferId] = intent;
    }

    /**
     * @dev Update hook configuration
     * @param protocol Protocol identifier
     * @param config New configuration
     */
    function updateHookConfig(
        string calldata protocol,
        HookConfig calldata config
    ) external onlyOwner {
        hookConfigs[protocol] = config;
    }

    /**
     * @dev Add or remove authorized executors
     * @param executor Address to authorize/revoke
     * @param authorized Whether to authorize
     */
    function setAuthorizedExecutor(address executor, bool authorized) external onlyOwner {
        authorizedExecutors[executor] = authorized;
    }

    /**
     * @dev Emergency function to recover stuck tokens
     * @param token Token address to recover
     * @param to Recipient address
     * @param amount Amount to recover
     */
    function emergencyRecover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "BorderHopHook: Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @dev Get transfer intent details
     * @param transferId Transfer identifier
     * @return intent Transfer intent details
     */
    function getTransferIntent(bytes32 transferId) external view returns (TransferIntent memory intent) {
        return transferIntents[transferId];
    }

    /**
     * @dev Get hook configuration
     * @param protocol Protocol identifier
     * @return config Hook configuration
     */
    function getHookConfig(string calldata protocol) external view returns (HookConfig memory config) {
        return hookConfigs[protocol];
    }

    /**
     * @dev Check if address is authorized executor
     * @param executor Address to check
     * @return authorized Whether the address is authorized
     */
    function isAuthorizedExecutor(address executor) external view returns (bool authorized) {
        return authorizedExecutors[executor] || executor == owner();
    }
} 