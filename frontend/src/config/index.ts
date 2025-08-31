// BorderHop Frontend Configuration
// Updated with deployed contract addresses

export const config = {
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

  // Supported Networks
  networks: [
    {
      id: 11155111,
      name: "Ethereum Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/7f8cfd008da04d88903a80bf28bfd0e5",
      blockExplorer: "https://sepolia.etherscan.io",
      contractAddress: "0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62",
      nativeCurrency: {
        name: "Sepolia ETH",
        symbol: "ETH",
        decimals: 18
      }
    }
  ],

  // Backend API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",
    endpoints: {
      transfer: "/api/remittance/transfer",
      status: "/api/remittance/status",
      history: "/api/remittance/history",
      analytics: "/api/analytics"
    }
  },

  // DeFi Protocol Settings
  defi: {
    protocols: [
      {
        id: "aave",
        name: "Aave",
        description: "Lend and borrow USDC",
        icon: "🏦",
        enabled: true
      },
      {
        id: "compound", 
        name: "Compound",
        description: "Earn interest on USDC",
        icon: "📈",
        enabled: true
      },
      {
        id: "uniswap",
        name: "Uniswap V3",
        description: "Swap USDC for other tokens",
        icon: "🔄",
        enabled: true
      }
    ]
  },

  // App Settings
  app: {
    name: "BorderHop",
    description: "AI-Powered Multichain USDC Remittance Gateway",
    version: "1.0.0",
    logo: "/assets/borderhop-logo.png"
  }
};

export default config; 