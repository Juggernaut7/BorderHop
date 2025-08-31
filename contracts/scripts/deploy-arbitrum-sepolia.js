const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BorderHopHook to Arbitrum Sepolia...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // CCTP V2 Arbitrum Sepolia addresses
  const CCTP_TOKEN_MESSENGER = "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5";
  const USDC_ARBITRUM_SEPOLIA = "0x75faf114eafb1BDbe2F0316E893AE4e7A6D6a2A6";

  console.log("🔗 CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
  console.log("💵 USDC Arbitrum Sepolia:", USDC_ARBITRUM_SEPOLIA);

  // Deploy BorderHopHook contract
  const BorderHopHook = await ethers.getContractFactory("BorderHopHook");
  const borderHopHook = await BorderHopHook.deploy(USDC_ARBITRUM_SEPOLIA, CCTP_TOKEN_MESSENGER);
  
  await borderHopHook.deployed();
  
  console.log("✅ BorderHopHook deployed to:", borderHopHook.address);
  console.log("📊 Transaction hash:", borderHopHook.deployTransaction.hash);
  
  // Wait for deployment confirmation
  await borderHopHook.deployTransaction.wait(5);
  console.log("🎉 Deployment confirmed!");
  
  // Verify the deployment
  console.log("🔍 Verifying contract on Arbiscan...");
  try {
    await hre.run("verify:verify", {
      address: borderHopHook.address,
      constructorArguments: [USDC_ARBITRUM_SEPOLIA, CCTP_TOKEN_MESSENGER],
    });
    console.log("✅ Contract verified on Arbiscan!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
  
  console.log("\n🎯 Deployment Summary:");
  console.log("Network: Arbitrum Sepolia");
  console.log("Contract: BorderHopHook");
  console.log("Address:", borderHopHook.address);
  console.log("Deployer:", deployer.address);
  console.log("CCTP Token Messenger:", CCTP_TOKEN_MESSENGER);
  console.log("USDC:", USDC_ARBITRUM_SEPOLIA);
  
  console.log("\n🚀 BorderHop is ready to revolutionize cross-chain remittances on Arbitrum!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 