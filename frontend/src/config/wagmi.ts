import { http, createConfig } from 'wagmi';
import { sepolia, baseSepolia, arbitrumSepolia } from 'wagmi/chains';
import { 
  injected, 
  metaMask
} from 'wagmi/connectors';

// Configure chains for the app
export const chains = [
  sepolia,      // Ethereum Sepolia testnet
  baseSepolia,  // Base Sepolia testnet
  arbitrumSepolia, // Arbitrum Sepolia testnet
] as const;

// Configure your dApps chains
export const config = createConfig({
  chains,
  connectors: [
    // Injected connector (supports most wallets including Rabby, Trust Wallet, etc.)
    injected(),
    
    // MetaMask
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_PROJECT_ID || '7b9e224980974fa88809386d7c7c6803'}`),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
});

// Chain configuration for BorderHop
export const chainConfig = {
  [sepolia.id]: {
    name: 'Ethereum Sepolia',
    shortName: 'ETH',
    color: '#627eea',
    icon: '🔷',
    rpc: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_PROJECT_ID || 'your_infura_key'}`,
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    shortName: 'BASE',
    color: '#0052ff',
    icon: '🔵',
    rpc: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [arbitrumSepolia.id]: {
    name: 'Arbitrum Sepolia',
    shortName: 'ARB',
    color: '#28a0f0',
    icon: '🔵',
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// USDC token addresses for each chain
export const usdcAddresses = {
  [sepolia.id]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7c',
  [arbitrumSepolia.id]: '0x75faf114eafb1BDbe2F0316E893AE4e7A6D6a2A6',
};

// CCTP TokenMessenger addresses
export const tokenMessengerAddresses = {
  [sepolia.id]: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5',
  [baseSepolia.id]: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5',
  [arbitrumSepolia.id]: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5',
};

// Chain domains for CCTP
export const chainDomains = {
  [sepolia.id]: 0,
  [baseSepolia.id]: 6,
  [arbitrumSepolia.id]: 3,
};

// Gas estimation for each chain
export const gasEstimates = {
  [sepolia.id]: {
    low: 15,
    medium: 25,
    high: 35,
    unit: 'gwei',
  },
  [baseSepolia.id]: {
    low: 0.005,
    medium: 0.008,
    high: 0.012,
    unit: 'gwei',
  },
  [arbitrumSepolia.id]: {
    low: 0.008,
    medium: 0.012,
    high: 0.018,
    unit: 'gwei',
  },
};

// DeFi protocol addresses (for future integration)
export const defiProtocols = {
  [sepolia.id]: {
    aave: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    compound: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
    curve: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  [baseSepolia.id]: {
    aave: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    compound: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
  },
  [arbitrumSepolia.id]: {
    aave: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    gmx: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
  },
};

export default config; 