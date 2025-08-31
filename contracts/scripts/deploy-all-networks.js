const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BorderHopHook to all testnets...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // CCTP V2 Testnet addresses
  const CCTP_ADDRESSES = {
    ethereum: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
    base: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
    arbitrum: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5"
  };

  // USDC Testnet addresses
  const USDC_ADDRESSES = {
    ethereum: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    base: "0x036CbD53842c5426634e7929541eC2318f3dCF7c",
    arbitrum: "0x75faf114eafb1BDbe2F0316E893AE4e7A6D6a2A6"
  };

  // Network configurations
  const networks = [
    { name: "Ethereum Sepolia", network: "sepolia", chainId: 11155111 },
    { name: "Base Sepolia", network: "base-sepolia", chainId: 84532 },
    { name: "Arbitrum Sepolia", network: "arbitrum-sepolia", chainId: 421614 }
  ];

  const deployedContracts = {};

  for (const networkConfig of networks) {
    console.log(`\n🌐 Deploying to ${networkConfig.name}...`);
    
    try {
      // Get network-specific provider
      const provider = new ethers.providers.JsonRpcProvider(
        networkConfig.network === "sepolia" 
          ? `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          : networkConfig.network === "base-sepolia"
          ? "https://sepolia.base.org"
          : "https://sepolia-rollup.arbitrum.io/rpc"
      );

      // Connect deployer to the network
      const deployerWithProvider = deployer.connect(provider);
      
      // Get USDC and CCTP addresses for this network
      const usdcAddress = USDC_ADDRESSES[networkConfig.network.split('-')[0]];
      const cctpAddress = CCTP_ADDRESSES[networkConfig.network.split('-')[0]];

      console.log(`🔗 CCTP Token Messenger: ${cctpAddress}`);
      console.log(`💵 USDC: ${usdcAddress}`);

      // Deploy BorderHopHook contract
      const BorderHopHook = await ethers.getContractFactory("BorderHopHook");
      const borderHopHook = await BorderHopHook.connect(deployerWithProvider).deploy(
        usdcAddress, 
        cctpAddress
      );
      
      await borderHopHook.deployed();
      
      console.log(`✅ BorderHopHook deployed to ${networkConfig.name}:`, borderHopHook.address);
      console.log(`📊 Transaction hash:`, borderHopHook.deployTransaction.hash);
      
      // Wait for deployment confirmation
      await borderHopHook.deployTransaction.wait(3);
      console.log(`🎉 Deployment confirmed on ${networkConfig.name}!`);
      
      // Store deployment info
      deployedContracts[networkConfig.name] = {
        address: borderHopHook.address,
        network: networkConfig.network,
        chainId: networkConfig.chainId,
        txHash: borderHopHook.deployTransaction.hash,
        usdc: usdcAddress,
        cctp: cctpAddress
      };

      // Verify the deployment
      console.log(`🔍 Verifying contract on ${networkConfig.name}...`);
      try {
        await hre.run("verify:verify", {
          address: borderHopHook.address,
          constructorArguments: [usdcAddress, cctpAddress],
          network: networkConfig.network
        });
        console.log(`✅ Contract verified on ${networkConfig.name}!`);
      } catch (error) {
        console.log(`⚠️ Verification failed on ${networkConfig.name}:`, error.message);
      }

    } catch (error) {
      console.error(`❌ Deployment failed on ${networkConfig.name}:`, error.message);
    }
  }

  // Print deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎯 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  
  for (const [networkName, contractInfo] of Object.entries(deployedContracts)) {
    console.log(`\n🌐 ${networkName}:`);
    console.log(`   Contract: ${contractInfo.address}`);
    console.log(`   Network: ${contractInfo.network}`);
    console.log(`   Chain ID: ${contractInfo.chainId}`);
    console.log(`   TX Hash: ${contractInfo.txHash}`);
    console.log(`   USDC: ${contractInfo.usdc}`);
    console.log(`   CCTP: ${contractInfo.cctp}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🚀 BorderHop is ready to revolutionize cross-chain remittances!");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 