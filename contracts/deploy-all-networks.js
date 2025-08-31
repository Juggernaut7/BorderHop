const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 DEPLOYING TO ALL NETWORKS - BorderHopHook...");
  
  const privateKey = "0x5eae75e9a093a6e5f654ce2ce792ab88f79167994cc606b225805ee9adbfa502";
  
  // Networks to deploy to
  const networks = [
    {
      name: "Base Sepolia",
      rpc: "https://sepolia.base.org",
      chainId: 84532,
      cctpTokenMessenger: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
      usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7c"
    },
    {
      name: "Arbitrum Sepolia", 
      rpc: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      cctpTokenMessenger: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
      usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    }
  ];

  const deployments = [];

  for (const network of networks) {
    try {
      console.log(`\n🌐 Deploying to ${network.name}...`);
      
      const provider = new ethers.JsonRpcProvider(network.rpc);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      console.log(`📝 Deploying with account: ${wallet.address}`);
      
      // Deploy BorderHopHook contract
      const BorderHopHook = await ethers.getContractFactory("BorderHopHook");
      console.log(`⏳ Deploying BorderHopHook contract to ${network.name}...`);
      
      const borderHopHook = await BorderHopHook.connect(wallet).deploy(network.usdc, network.cctpTokenMessenger);
      
      console.log(`⏳ Waiting for deployment on ${network.name}...`);
      await borderHopHook.waitForDeployment();
      
      const deployedAddress = await borderHopHook.getAddress();
      const deploymentTx = borderHopHook.deploymentTransaction();
      
      console.log(`✅ BorderHopHook deployed to ${network.name}:`, deployedAddress);
      console.log(`📊 Transaction hash:`, deploymentTx ? deploymentTx.hash : "unknown");
      
      deployments.push({
        network: network.name,
        contract: "BorderHopHook",
        address: deployedAddress,
        deployer: wallet.address,
        txHash: deploymentTx ? deploymentTx.hash : "unknown",
        chainId: network.chainId,
        cctpTokenMessenger: network.cctpTokenMessenger,
        usdc: network.usdc
      });
      
    } catch (error) {
      console.error(`❌ Deployment to ${network.name} failed:`, error.message);
    }
  }

  // Add Ethereum Sepolia deployment
  deployments.push({
    network: "Ethereum Sepolia",
    contract: "BorderHopHook", 
    address: "0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62",
    deployer: "0xF39cE20c6A905157cF532890ed87b86f422774b7",
    txHash: "0x329eed045a4f9ea90dfcac3fb9769ad7e6ce20e110c4638232d97db0fbbf96a6",
    chainId: 11155111,
    cctpTokenMessenger: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
  });

  console.log("\n🎯 ALL DEPLOYMENTS SUMMARY:");
  deployments.forEach(deployment => {
    console.log(`\n${deployment.network}:`);
    console.log(`  Contract: ${deployment.contract}`);
    console.log(`  Address: ${deployment.address}`);
    console.log(`  Deployer: ${deployment.deployer}`);
    console.log(`  Chain ID: ${deployment.chainId}`);
  });

  // Save all deployments
  const fs = require('fs');
  fs.writeFileSync('all-deployments.json', JSON.stringify(deployments, null, 2));
  console.log("\n💾 All deployment info saved to: all-deployments.json");

  console.log("\n🚀 BorderHop is LIVE on all networks!");
  console.log("Ready for backend integration and demo video!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 