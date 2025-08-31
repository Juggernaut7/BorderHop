const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 PUBLIC RPC DEPLOYMENT - BorderHopHook to Ethereum Sepolia...");
  
  // Use public RPC endpoints
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
  
  // Create wallet from private key
  const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📝 Deploying with account:", wallet.address);
  console.log("💰 Account balance:", (await wallet.getBalance()).toString());

  // CCTP V2 Sepolia addresses
  const CCTP_TOKEN_MESSENGER = "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5";
  const USDC_SEPOLIA = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  console.log("🔗 CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
  console.log("💵 USDC Sepolia:", USDC_SEPOLIA);

  try {
    // Deploy BorderHopHook contract
    const BorderHopHook = await ethers.getContractFactory("BorderHopHook");
    const borderHopHook = await BorderHopHook.connect(wallet).deploy(USDC_SEPOLIA, CCTP_TOKEN_MESSENGER);
    
    console.log("⏳ Deploying... Transaction hash:", borderHopHook.deployTransaction.hash);
    
    await borderHopHook.deployed();
    
    console.log("✅ BorderHopHook deployed to:", borderHopHook.address);
    console.log("📊 Transaction hash:", borderHopHook.deployTransaction.hash);
    
    // Wait for deployment confirmation
    await borderHopHook.deployTransaction.wait(3);
    console.log("🎉 Deployment confirmed!");
    
    console.log("\n🎯 DEPLOYMENT SUMMARY:");
    console.log("Network: Ethereum Sepolia");
    console.log("Contract: BorderHopHook");
    console.log("Address:", borderHopHook.address);
    console.log("Deployer:", wallet.address);
    console.log("CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
    console.log("USDC:", USDC_SEPOLIA);
    console.log("Etherscan:", `https://sepolia.etherscan.io/address/${borderHopHook.address}`);
    
    console.log("\n🚀 BorderHop is LIVE and ready to revolutionize cross-chain remittances!");
    
    // Save deployment info
    const deploymentInfo = {
      network: "Ethereum Sepolia",
      contract: "BorderHopHook",
      address: borderHopHook.address,
      deployer: wallet.address,
      txHash: borderHopHook.deployTransaction.hash,
      etherscan: `https://sepolia.etherscan.io/address/${borderHopHook.address}`,
      timestamp: new Date().toISOString()
    };
    
    console.log("\n📋 DEPLOYMENT INFO FOR SUBMISSION:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check if you have Sepolia ETH in your wallet");
    console.log("2. Verify your private key in .env file");
    console.log("3. Try getting Sepolia ETH from: https://sepoliafaucet.com/");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 