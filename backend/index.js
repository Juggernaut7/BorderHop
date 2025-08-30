const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers } = require('ethers');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from env.local
dotenv.config({ path: path.resolve(__dirname, 'env.local') });

// MongoDB Connection with Retry Logic
const connectToMongoDB = async (maxAttempts = 5) => {
  // Remove /hop from the URI and fix the connection string
  let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/borderhop';
  
  // Fix the URI by removing /hop if it exists
  if (MONGODB_URI.includes('/hop')) {
    MONGODB_URI = MONGODB_URI.replace('/hop', '');
  }
  
  console.log(`🔍 Attempting to connect to: ${MONGODB_URI}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${maxAttempts})...`);
      
      await mongoose.connect(MONGODB_URI, {
        // Remove deprecated options
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      });
      
      console.log('✅ MongoDB connected successfully');
      return true;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxAttempts) {
        console.error('❌ All MongoDB connection attempts failed. Using fallback...');
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Initialize MongoDB connection
let mongoConnected = false;
(async () => {
  mongoConnected = await connectToMongoDB(5);
  if (!mongoConnected) {
    console.log('⚠️ Using in-memory storage for demo purposes');
  }
})();

const app = express();
const PORT = process.env.PORT || 3001;

// Circle API Configuration
const CIRCLE_CONFIG = {
  apiKey: process.env.CIRCLE_API_KEY || '',
  clientKey: process.env.CIRCLE_CLIENT_KEY || '',
  environment: process.env.CIRCLE_ENVIRONMENT || 'testnet',
  baseUrl: process.env.CIRCLE_ENVIRONMENT === 'mainnet' 
    ? 'https://api.circle.com/v1' 
    : 'https://api-sandbox.circle.com/v1'
};

// Blockchain RPC Configuration
const RPC_CONFIG = {
  ethereum: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
  base: 'https://sepolia.base.org',
  arbitrum: 'https://sepolia-rollup.arbitrum.io/rpc'
};

// CCTP V2 Configuration - Testnet addresses
const CCTP_CONFIG = {
  ethereum: {
    domain: 0,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Sepolia
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    rpc: RPC_CONFIG.ethereum
  },
  base: {
    domain: 6,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Base Sepolia
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7c', // Base Sepolia USDC
    rpc: RPC_CONFIG.base
  },
  arbitrum: {
    domain: 3,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Arbitrum Sepolia
    usdc: '0x75faf114eafb1BDbe2F0316E893AE4e7A6D6a2A6', // Arbitrum Sepolia USDC
    rpc: RPC_CONFIG.arbitrum
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Import route modules
const remittanceRoutes = require('./routes/remittance');
const defiRoutes = require('./routes/defi');
const analyticsRoutes = require('./routes/analytics');

// Routes
app.use('/api/remittance', remittanceRoutes);
app.use('/api/defi', defiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'BorderHop Backend',
    version: '1.0.0',
    database: mongoConnected ? 'connected' : 'disconnected',
    circle: {
      environment: CIRCLE_CONFIG.environment,
      apiConfigured: !!CIRCLE_CONFIG.apiKey,
      clientConfigured: !!CIRCLE_CONFIG.clientKey
    },
    chains: Object.keys(CCTP_CONFIG),
    timestamp: new Date().toISOString()
  });
});

// Circle CCTP V2 Status endpoint
app.get('/api/circle/status', (req, res) => {
  res.json({
    status: 'configured',
    environment: CIRCLE_CONFIG.environment,
    baseUrl: CIRCLE_CONFIG.baseUrl,
    supportedChains: Object.keys(CCTP_CONFIG).map(chain => ({
      name: chain,
      domain: CCTP_CONFIG[chain].domain,
      usdc: CCTP_CONFIG[chain].usdc,
      tokenMessenger: CCTP_CONFIG[chain].tokenMessenger
    })),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 BorderHop Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Circle CCTP Status: http://localhost:${PORT}/api/circle/status`);
  console.log(`🔑 Circle Environment: ${CIRCLE_CONFIG.environment}`);
  console.log(`✅ API Key: ${CIRCLE_CONFIG.apiKey ? 'Configured' : 'Missing'}`);
  console.log(`✅ Client Key: ${CIRCLE_CONFIG.clientKey ? 'Configured' : 'Missing'}`);
});    

module.exports = app; 