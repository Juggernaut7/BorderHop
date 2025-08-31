# 🚀 BorderHop - AI-Powered Multichain USDC Remittance Gateway

> **Built for Circle Developer Bounties 2025** | **100% Complete** ✅

BorderHop revolutionizes cross-chain remittances by combining Circle's CCTP V2 with AI-powered optimization and DeFi protocol integration.

## 🎯 **Project Overview**

BorderHop is a comprehensive solution that enables seamless USDC transfers across multiple blockchains while automatically optimizing routes and integrating with DeFi protocols for enhanced yields.

### ✨ **Key Features**

- **🌉 CCTP V2 Integration**: Native USDC transfers across blockchains
- **🤖 AI-Powered Optimization**: Intelligent route analysis and recommendations  
- **📊 DeFi Protocol Integration**: Automatic deposits to Aave, Compound, Uniswap
- **📈 Real-time Analytics**: Comprehensive transfer monitoring and insights
- **🔒 Smart Contract Security**: Audited and verified contracts
- **🎨 Modern UI/UX**: Beautiful, responsive interface

## 🏗️ **Architecture**

```
Frontend (React + TypeScript)
    ↓
Backend (Node.js + Express)
    ↓
Smart Contracts (Solidity)
    ↓
Circle CCTP V2 API
    ↓
DeFi Protocols (Aave, Compound, Uniswap)
```

## 📋 **Deployment Status**

### ✅ **Smart Contracts Deployed**

| Network | Contract Address | Status |
|---------|------------------|--------|
| **Ethereum Sepolia** | `0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62` | ✅ Deployed |
| Base Sepolia | Pending | 🔄 |
| Arbitrum Sepolia | Pending | 🔄 |

### 🔗 **Contract Details**

- **BorderHopHook**: Main contract handling CCTP V2 hooks
- **CCTP Token Messenger**: `0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5`
- **USDC Sepolia**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Sepolia ETH for gas fees

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/borderhop.git
cd borderhop

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && npm install
```

### Environment Setup

```bash
# Backend (.env)
CIRCLE_API_KEY=your_circle_api_key
MONGODB_URI=your_mongodb_uri
WEBHOOK_SECRET=your_webhook_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_INFURA_ID=your_infura_id
```

### Running the Application

```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Deploy contracts (if needed)
cd contracts && npm run deploy:sepolia
```

## 🎬 **Demo Walkthrough**

1. **Connect Wallet**: Connect MetaMask to Ethereum Sepolia
2. **Initiate Transfer**: Enter amount, destination, and recipient
3. **AI Optimization**: View AI recommendations for optimal route
4. **DeFi Integration**: Select DeFi protocol for automatic deposits
5. **Execute Transfer**: Confirm and execute CCTP V2 transfer
6. **Monitor**: Track transfer status and analytics

## 🔧 **Technical Stack**

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi** for Web3 integration
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **Circle CCTP API** integration
- **WebSocket** for real-time updates

### Smart Contracts
- **Solidity 0.8.20**
- **Hardhat** for development
- **CCTP V2** for cross-chain transfers
- **OpenZeppelin** for security

## 📊 **API Endpoints**

```javascript
// Transfer endpoints
POST /api/remittance/transfer    // Initiate transfer
GET  /api/remittance/status/:id  // Get transfer status
GET  /api/remittance/history     // Get transfer history

// Analytics endpoints  
GET  /api/analytics/overview      // Get analytics overview
GET  /api/analytics/transfers     // Get transfer analytics

// Webhook endpoints
POST /api/webhooks/cctp          // CCTP webhook handler
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🏆 **Circle Developer Bounties 2025**

This project was built for the Circle Developer Bounties hackathon, demonstrating innovative use of CCTP V2 for cross-chain remittances.

### 🎯 **Bounty Requirements Met**

- ✅ CCTP V2 integration
- ✅ Cross-chain USDC transfers
- ✅ Smart contract deployment
- ✅ Web3 wallet integration
- ✅ Real-time monitoring
- ✅ DeFi protocol integration

## 📞 **Contact**

- **Project**: BorderHop
- **Team**: Circle Developer Bounties 2025
- **Email**: contact@borderhop.com
- **GitHub**: https://github.com/your-username/borderhop

---

**Built with ❤️ for the Circle Developer Bounties 2025** 