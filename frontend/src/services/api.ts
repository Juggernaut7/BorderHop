import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// API Service Class
export class BorderHopAPI {
  // Health check
  static async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }

  // Get supported chains
  static async getSupportedChains() {
    const response = await api.get('/remittance/chains');
    return response.data;
  }

  // Get CCTP V2 status
  static async getCCTPStatus() {
    const response = await api.get('/remittance/cctp/status');
    return response.data;
  }

  // Calculate optimal route
  static async calculateRoute(routeData: {
    amount: number;
    sourceChain: string;
    destinationChain: string;
    intent: string;
  }) {
    const response = await api.post('/remittance/route', routeData);
    return response.data;
  }

  // Initiate transfer - FIXED ENDPOINT
  static async initiateTransfer(transferData: {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    sourceChain: string;
    destinationChain: string;
    intent: string;
    email?: string;
    note?: string;
  }) {
    const response = await api.post('/remittance/initiate', transferData);
    return response.data;
  }

  // Get transfer status
  static async getTransferStatus(transferId: string) {
    const response = await api.get(`/remittance/status/${transferId}`);
    return response.data;
  }

  // Get transfer history
  static async getTransferHistory(address: string) {
    const response = await api.get(`/remittance/history/${address}`);
    return response.data;
  }

  // Get DeFi yields
  static async getDeFiYields() {
    const response = await api.get('/defi/yields');
    return response.data;
  }

  // Get gas prices
  static async getGasPrices() {
    const response = await api.get('/defi/gas-prices');
    return response.data;
  }

  // Get analytics
  static async getAnalytics() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }
}

// Export default instance
export default BorderHopAPI; 