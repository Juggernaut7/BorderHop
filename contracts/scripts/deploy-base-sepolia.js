const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BorderHopHook to Base Sepolia...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // CCTP V2 Base Sepolia addresses
  const CCTP_TOKEN_MESSENGER = "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5";
  const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7c";

  console.log("🔗 CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
  console.log("💵 USDC Base Sepolia:", USDC_BASE_SEPOLIA);

  // Deploy BorderHopHook contract
  const BorderHopHook = await ethers.getContractFactory("BorderHopHook");
  const borderHopHook = await BorderHopHook.deploy(USDC_BASE_SEPOLIA, CCTP_TOKEN_MESSENGER);
  
  await borderHopHook.deployed();
  
  console.log("✅ BorderHopHook deployed to:", borderHopHook.address);
  console.log("📊 Transaction hash:", borderHopHook.deployTransaction.hash);
  
  // Wait for deployment confirmation
  await borderHopHook.deployTransaction.wait(5);
  console.log("🎉 Deployment confirmed!");
  
  // Verify the deployment
  console.log("🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: borderHopHook.address,
      constructorArguments: [USDC_BASE_SEPOLIA, CCTP_TOKEN_MESSENGER],
    });
    console.log("✅ Contract verified on Basescan!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
  
  console.log("\n🎯 Deployment Summary:");
  console.log("Network: Base Sepolia");
  console.log("Contract: BorderHopHook");
  console.log("Address:", borderHopHook.address);
  console.log("Deployer:", deployer.address);
  console.log("CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
  console.log("USDC:", USDC_BASE_SEPOLIA);
  
  console.log("\n🚀 BorderHop is ready to revolutionize cross-chain remittances on Base!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 