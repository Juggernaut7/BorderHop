# BorderHop Frontend 🚀

AI-Powered Multichain USDC Remittance Gateway Frontend

## Overview

BorderHop is a revolutionary web3 application that enables seamless cross-border remittances using Circle's CCTP (Cross-Chain Transfer Protocol) and AI-powered routing optimization. This frontend provides an intuitive, modern interface for users to manage their cross-chain USDC transfers.

## Features

### 🎯 Core Functionality
- **Wallet Integration**: Connect MetaMask, WalletConnect, and other EVM wallets
- **Multichain Support**: Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia
- **AI-Powered Routing**: Intelligent chain selection based on fees, yields, and user intent
- **Transfer Management**: Complete transfer flow from initiation to completion
- **Real-time Status**: Live tracking of transfer progress across chains

### 🎨 User Experience
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Dark/Light Mode**: Adaptive theming system (coming soon)

### 🔗 Web3 Integration
- **Wagmi Hooks**: Modern React hooks for Ethereum
- **Multi-wallet Support**: MetaMask, WalletConnect, and injected wallets
- **Chain Switching**: Seamless network switching between supported chains
- **Transaction Management**: Handle wallet connections and transaction signing

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts (for future analytics)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser with wallet extension (MetaMask recommended)

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the frontend directory:
```bash
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_BACKEND_URL=http://localhost:3001
```

4. **Start development server**
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── wallet/         # Wallet-related components
│   │   └── transfer/       # Transfer flow components
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Transfer.tsx    # Main transfer interface
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── Analytics.tsx   # Analytics page
│   │   └── History.tsx     # Transfer history
│   ├── config/             # Configuration files
│   │   └── wagmi.ts        # Wagmi configuration
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Key Components

### 🧭 Navigation
- **Navbar**: Main navigation with wallet connection and chain selector
- **Footer**: Links and company information
- **ChainSelector**: Switch between supported blockchain networks

### 💳 Wallet Integration
- **ConnectWallet**: Connect various wallet providers
- **Wallet Status**: Display connected wallet information
- **Network Switching**: Change between supported chains

### 📤 Transfer Flow
- **TransferForm**: Input transfer details and intent
- **TransferPreview**: Review transfer before confirmation
- **TransferStatus**: Track transfer progress and completion

### 📊 Dashboard & Analytics
- **Dashboard**: Overview of transfer activity and quick actions
- **Analytics**: Performance metrics and insights (coming soon)
- **History**: Complete transfer history (coming soon)

## Configuration

### Wagmi Configuration
The `src/config/wagmi.ts` file contains:
- Supported chains (Ethereum, Base, Arbitrum testnets)
- Wallet connectors (MetaMask, WalletConnect, injected)
- RPC endpoints for each chain
- USDC token addresses
- CCTP configuration

### Tailwind CSS
Custom design system with:
- BorderHop brand colors
- Chain-specific color schemes
- Responsive breakpoints
- Custom animations and utilities

## Development

### Adding New Features

1. **New Page**: Create in `src/pages/` directory
2. **New Component**: Create in `src/components/` directory
3. **New Route**: Add to `src/App.tsx` routing
4. **Styling**: Use Tailwind CSS classes and custom components

### Component Guidelines

- Use TypeScript interfaces for props
- Implement responsive design
- Add Framer Motion animations
- Follow the established design system
- Use the custom button and input classes

### State Management

- Use React hooks for local state
- Wagmi hooks for web3 state
- React Hook Form for form management
- Context API for global state (if needed)

## Building for Production

### Build Command
```bash
npm run build
```

### Output
The build creates a `dist/` directory with optimized production files.

### Deployment
Deploy the `dist/` directory to your hosting service:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

## Testing

### Development Testing
```bash
# Run linting
npm run lint

# Preview production build
npm run preview
```

### Browser Testing
Test with:
- Chrome/Edge (with MetaMask)
- Firefox (with MetaMask)
- Mobile browsers
- Different screen sizes

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on a supported network
   - Try refreshing the page

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check TypeScript compilation
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify custom CSS classes

### Getting Help

- Check the console for error messages
- Review the browser's network tab
- Ensure backend is running (if testing full stack)
- Check wallet connection status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Test thoroughly
5. Submit a pull request

## Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issue with detailed description
- **Community**: Join our Discord for help and discussions

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Circle Developer Bounties Hackathon**

*BorderHop: Where borders disappear and money works smarter* 🚀
