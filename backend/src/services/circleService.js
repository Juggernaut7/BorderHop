const axios = require('axios');

class CircleCCTPService {
  constructor() {
    this.apiKey = process.env.CIRCLE_API_KEY || '';
    this.baseUrl = process.env.CIRCLE_ENVIRONMENT === 'mainnet' 
      ? 'https://api.circle.com/v1' 
      : 'https://api-sandbox.circle.com/v1';
  }

  // Initialize a CCTP V2 transfer (burn)
  async initiateTransfer(amount, sourceChain, destinationChain, recipient) {
    try {
      const response = await axios.post(`${this.baseUrl}/transfers/burn`, {
        amount: amount.toString(),
        sourceChain,
        destinationChain,
        recipient,
        metadata: {
          source: 'borderhop',
          intent: 'remittance'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        transferId: response.data.data.transferId,
        txHash: response.data.data.txHash,
        status: 'pending'
      };
    } catch (error) {
      console.error('Circle API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Get transfer status
  async getTransferStatus(transferId) {
    try {
      const response = await axios.get(`${this.baseUrl}/transfers/${transferId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        status: response.data.data.status,
        sourceTxHash: response.data.data.sourceTxHash,
        destinationTxHash: response.data.data.destinationTxHash,
        amount: response.data.data.amount,
        recipient: response.data.data.recipient
      };
    } catch (error) {
      console.error('Circle API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Get supported chains
  async getSupportedChains() {
    try {
      const response = await axios.get(`${this.baseUrl}/chains`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        chains: response.data.data.chains
      };
    } catch (error) {
      console.error('Circle API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Mock transfer for demo purposes (when API key is not available)
  async mockTransfer(amount, sourceChain, destinationChain, recipient) {
    const transferId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const txHash = `0x${Math.random().toString(36).substr(2, 64)}`;
    
    return {
      success: true,
      transferId,
      txHash,
      status: 'pending',
      mock: true
    };
  }

  // Mock status check for demo purposes
  async mockStatus(transferId) {
    const statuses = ['pending', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      success: true,
      status: randomStatus,
      sourceTxHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      destinationTxHash: randomStatus === 'completed' ? `0x${Math.random().toString(36).substr(2, 64)}` : null,
      amount: '1000000', // 1 USDC
      recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      mock: true
    };
  }
}

module.exports = CircleCCTPService; 