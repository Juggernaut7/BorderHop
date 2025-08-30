import axios from 'axios';

// Circle CCTP V2 Service
export class CircleCCTPService {
  private baseUrl: string;
  private apiKey: string;
  private clientKey: string;

  constructor() {
    this.baseUrl = process.env.CIRCLE_ENVIRONMENT === 'mainnet' 
      ? 'https://api.circle.com/v1' 
      : 'https://api-sandbox.circle.com/v1';
    this.apiKey = process.env.CIRCLE_API_KEY || '';
    this.clientKey = process.env.CIRCLE_CLIENT_KEY || '';
  }

  // Initialize CCTP transfer (burn USDC)
  async initiateTransfer(transferData: {
    amount: string;
    destinationAddress: string;
    destinationDomain: number;
    sourceDomain: number;
    senderAddress: string;
  }) {
    try {
      console.log('🔥 Initiating CCTP V2 transfer:', transferData);

      const response = await axios.post(
        `${this.baseUrl}/transfers/burn`,
        {
          amount: transferData.amount,
          destinationAddress: transferData.destinationAddress,
          destinationDomain: transferData.destinationDomain,
          sourceDomain: transferData.sourceDomain,
          senderAddress: transferData.senderAddress,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ CCTP V2 transfer initiated:', response.data);
      return {
        success: true,
        transferId: response.data.data.transferId,
        txHash: response.data.data.txHash,
        message: response.data.data.message,
      };
    } catch (error: any) {
      console.error('❌ CCTP V2 transfer failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // Get transfer status
  async getTransferStatus(transferId: string) {
    try {
      console.log('📊 Getting CCTP V2 transfer status:', transferId);

      const response = await axios.get(
        `${this.baseUrl}/transfers/${transferId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      console.log('✅ CCTP V2 transfer status:', response.data);
      return {
        success: true,
        status: response.data.data.status,
        burnTxHash: response.data.data.burnTxHash,
        mintTxHash: response.data.data.mintTxHash,
        completedAt: response.data.data.completedAt,
      };
    } catch (error: any) {
      console.error('❌ Failed to get CCTP V2 transfer status:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // Get supported domains
  async getSupportedDomains() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/domains`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        success: true,
        domains: response.data.data.domains,
      };
    } catch (error: any) {
      console.error('❌ Failed to get supported domains:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload: string, signature: string) {
    // TODO: Implement webhook signature validation
    // For MVP, we'll trust the webhook
    return true;
  }

  // Process webhook event
  async processWebhookEvent(event: any) {
    try {
      console.log('🔄 Processing CCTP V2 webhook event:', event);

      const { transferId, status, destinationTxHash, error } = event;

      return {
        success: true,
        transferId,
        status,
        destinationTxHash,
        error,
      };
    } catch (error: any) {
      console.error('❌ Failed to process webhook event:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new CircleCCTPService(); 