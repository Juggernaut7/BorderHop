# BorderHop Backend 🚀

AI-Powered Multichain USDC Remittance Gateway Backend

## Overview

BorderHop is a revolutionary web3 application that enables seamless cross-border remittances using Circle's CCTP (Cross-Chain Transfer Protocol) and AI-powered routing optimization. This backend service handles all the core functionality including:

- **Multichain USDC Transfers** via Circle CCTP V2
- **AI-Powered Routing** with real-time gas and yield optimization
- **DeFi Integration** for post-transfer yield maximization
- **Analytics & Insights** for transfer optimization and cost savings
- **Real-time Notifications** via email and SMS

## Features

### 🎯 Core Functionality
- **CCTP Integration**: Seamless USDC transfers across Ethereum, Base, and Arbitrum
- **Smart Routing**: AI-powered chain selection based on fees, yields, and user intent
- **Intent Matching**: Support for "maximize yield", "minimize fees", and "standard" transfer modes
- **Post-Transfer Hooks**: Automatic DeFi deposits and yield optimization

### 🔗 Supported Chains
- **Ethereum Sepolia** (Testnet)
- **Base Sepolia** (Testnet) 
- **Arbitrum Sepolia** (Testnet)

### 📊 Analytics & Insights
- Real-time transfer statistics
- Cost savings vs traditional remittances
- Performance metrics and trends
- User behavior insights and recommendations

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Circle Developer Account (for CCTP access)
- Infura/Alchemy account (for blockchain RPC)

### Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp env.example .env
# Edit .env with your actual API keys
```

4. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Required
CIRCLE_API_KEY=your_circle_api_key
INFURA_KEY=your_infura_project_id

# Optional (for enhanced features)
DEFI_LLAMA_API_KEY=your_defi_llama_key
TWILIO_ACCOUNT_SID=your_twilio_sid
SMTP_USER=your_email@gmail.com
```

## API Endpoints

### 🔄 Remittance Routes

#### `POST /api/remittance/initiate`
Initialize a new USDC transfer with AI routing optimization.

**Request Body:**
```json
{
  "senderAddress": "0x...",
  "recipientAddress": "0x...",
  "amount": 100,
  "sourceChain": "ethereum",
  "destinationChain": "base",
  "intent": "maximize_yield",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "transferId": "BH_1234567890_abc123",
  "transferDetails": { ... },
  "routeData": {
    "optimalChain": "base",
    "estimatedFees": 0.011,
    "suggestedActions": ["Auto-deposit to base for 5.20% APY"]
  }
}
```

#### `GET /api/remittance/status/:transferId`
Get the current status of a transfer.

#### `GET /api/remittance/chains`
Get list of supported blockchain networks.

#### `GET /api/remittance/history/:address`
Get transfer history for a specific wallet address.

### 🏦 DeFi Routes

#### `GET /api/defi/protocols`
Get available DeFi protocols and current APY rates.

#### `POST /api/defi/optimize-yield`
Get AI-powered yield optimization recommendations.

#### `POST /api/defi/simulate-deposit`
Simulate a DeFi deposit operation.

#### `GET /api/defi/liquidity/:chain`
Get liquidity pool information for a specific chain.

#### `GET /api/defi/farming/:chain`
Get yield farming opportunities on a specific chain.

#### `GET /api/defi/gas-optimization/:chain`
Get gas optimization recommendations for a specific chain.

### 📈 Analytics Routes

#### `GET /api/analytics/dashboard`
Get comprehensive analytics dashboard with key metrics.

#### `GET /api/analytics/savings-comparison`
Compare BorderHop fees vs traditional remittance services.

#### `GET /api/analytics/performance`
Get performance metrics for different timeframes.

#### `GET /api/analytics/insights`
Get AI-generated insights and recommendations.

#### `GET /api/analytics/realtime`
Get real-time network status and metrics.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│                 │    │                 │    │                 │
│  React App      │◄──►│  Express API    │◄──►│  CCTP Protocol  │
│                 │    │                 │    │                 │
│  Wallet Connect │    │  AI Routing     │    │  USDC Mint/Burn │
│                 │    │  DeFi Data      │    │  Smart Hooks    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Analytics     │
                       │                 │
                       │  Transfer Stats │
                       │  Cost Savings   │
                       │  Performance    │
                       └─────────────────┘
```

## Development

### Project Structure
```
backend/
├── routes/           # API route handlers
│   ├── remittance.js # Core transfer logic
│   ├── defi.js      # DeFi integration
│   └── analytics.js # Analytics & insights
├── middleware/       # Custom middleware
├── services/        # Business logic services
├── utils/           # Utility functions
├── index.js         # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

### Adding New Features

1. **New Route**: Create in `routes/` directory
2. **New Service**: Add to `services/` directory  
3. **Middleware**: Add to `middleware/` directory
4. **Update**: Add route to main `index.js`

### Testing

```bash
# Run tests (when implemented)
npm test

# Health check
curl http://localhost:3001/health
```

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production RPC endpoints
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS certificates
- [ ] Set up load balancing (if needed)
- [ ] Configure database (MongoDB/PostgreSQL)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- **Documentation**: [Circle CCTP Docs](https://developers.circle.com/developer/docs/cctp)
- **Issues**: Create GitHub issue
- **Discord**: Join our community

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Circle Developer Bounties Hackathon**

*BorderHop: Where borders disappear and money works smarter* 🚀 