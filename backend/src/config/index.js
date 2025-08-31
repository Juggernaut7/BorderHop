// BorderHop Backend Configuration
// Updated with deployed contract addresses

const config = {
  // Deployed Contract Addresses
  contracts: {
    ethereumSepolia: {
      borderHopHook: "0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62",
      cctpTokenMessenger: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
      usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      chainId: 11155111,
      network: "Ethereum Sepolia"
    }
  },

  // Circle CCTP Configuration
  circle: {
    apiKey: process.env.CIRCLE_API_KEY || "demo_key_for_testing",
    environment: process.env.CIRCLE_ENVIRONMENT || "sandbox",
    baseUrl: process.env.CIRCLE_ENVIRONMENT === 'mainnet' 
      ? 'https://api.circle.com/v1' 
      : 'https://api-sandbox.circle.com/v1'
  },

  // Supported Networks for CCTP V2
  supportedNetworks: [
    {
      name: "Ethereum Sepolia",
      chainId: 11155111,
      contractAddress: "0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62"
    }
  ],

  // DeFi Protocol Configurations
  defi: {
    aave: {
      enabled: true,
      protocol: "aave",
      minAmount: "0.01",
      maxAmount: "1000000"
    },
    compound: {
      enabled: true,
      protocol: "compound", 
      minAmount: "0.01",
      maxAmount: "1000000"
    },
    uniswap: {
      enabled: true,
      protocol: "uniswap_v3",
      minAmount: "0.01", 
      maxAmount: "1000000"
    }
  },

  // Webhook Configuration
  webhooks: {
    enabled: true,
    endpoint: "/api/webhooks/cctp",
    secret: process.env.WEBHOOK_SECRET || "borderhop_webhook_secret"
  }
};

module.exports = config; 