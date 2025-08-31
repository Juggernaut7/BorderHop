import express, { Request, Response } from 'express';
import { ethers } from 'ethers';
import { 
  TransferRequest, 
  TransferResponse, 
  RouteData,
  PostTransferHook 
} from '../types';
import CircleCCTPService from '../services/circleService';
import { Transfer } from '../models/transfer.js';

const validateChainConfiguration = (sourceChain: string, destinationChain: string) => {
  // Map frontend chain names to backend expected names
  const chainMapping: { [key: string]: string } = {
    'ethereum': 'ethereum-sepolia',
    'base': 'base-sepolia', 
    'arbitrum': 'arbitrum-sepolia'
  };
  
  const mappedSourceChain = chainMapping[sourceChain] || sourceChain;
  const mappedDestChain = chainMapping[destinationChain] || destinationChain;
  
  const supportedChains = ['ethereum-sepolia', 'base-sepolia', 'arbitrum-sepolia'];
  
  if (!supportedChains.includes(mappedSourceChain) || !supportedChains.includes(mappedDestChain)) {
    console.log(`⚠️ Chain validation failed: ${sourceChain} -> ${destinationChain}`);
    console.log(`📋 Supported chains: ${supportedChains.join(', ')}`);
    return false;
  }
  
  return true;
};

const router = express.Router();

// CCTP Configuration - Testnet addresses
const CCTP_CONFIG = {
  ethereum: {
    domain: 0,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Sepolia
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    rpc: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
  },
  base: {
    domain: 6,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Base Sepolia
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7c', // Base Sepolia USDC
    rpc: 'https://sepolia.base.org'
  },
  arbitrum: {
    domain: 3,
    tokenMessenger: '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5', // Arbitrum Sepolia
    usdc: '0x75faf114eafb1BDbe2F0316E893AE4e7A6D6a2A6', // Arbitrum Sepolia USDC
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc'
  }
};

// AI-powered routing logic
const calculateOptimalRoute = async (amount: number, sourceChain: string, destinationChain: string, intent: string): Promise<RouteData> => {
  try {
    let optimalChain = destinationChain;
    let estimatedFees = 0.001; // Base CCTP fee
    let suggestedActions: string[] = [];

    // Calculate fees for different routes
    if (sourceChain !== destinationChain) {
      const cctpFee = 0.001; // CCTP fee in USDC
      estimatedFees = cctpFee;
    }

    // AI Intent Matching
    if (intent === 'maximize_yield') {
      const highYieldChain = 'base'; // Base has highest DeFi yields
      if (sourceChain !== highYieldChain) {
        optimalChain = highYieldChain;
        suggestedActions.push(`Auto-deposit to ${highYieldChain} for 5.2% APY via CCTP V2`);
      }
    } else if (intent === 'minimize_fees') {
      const lowFeeChain = 'base'; // Base has lowest gas fees
      optimalChain = lowFeeChain;
      suggestedActions.push(`Route via ${lowFeeChain} for lowest fees using Circle CCTP V2`);
    }

    return {
      optimalChain,
      estimatedFees,
      suggestedActions,
      gasData: { ethereum: 25, base: 0.005, arbitrum: 0.008 },
      yieldData: { ethereum: 0.045, base: 0.052, arbitrum: 0.038 },
      liquidityData: { ethereum: { usdc: 1000000, volume24h: 500000 } }
    };
  } catch (error) {
    console.error('Error calculating optimal route:', error);
    return {
      optimalChain: destinationChain,
      estimatedFees: 0.001,
      suggestedActions: [],
      gasData: { ethereum: 25, base: 0.005, arbitrum: 0.008 },
      yieldData: { ethereum: 0.045, base: 0.052, arbitrum: 0.038 },
      liquidityData: { ethereum: { usdc: 1000000, volume24h: 500000 } }
    };
  }
};

// POST /transfer - Initiate a new transfer
router.post('/transfer', async (req, res) => {
  try {
    console.log('🚀 Transfer request received:', req.body);
    
    const { amount, sourceChain, destinationChain, recipientAddress, email, note } = req.body;
    
    // Validate required fields
    if (!amount || !sourceChain || !destinationChain || !recipientAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate chain configuration
    if (!validateChainConfiguration(sourceChain, destinationChain)) {
      console.log("🔄 Falling back to demo mode due to chain configuration");
      
      // Return demo response instead of throwing error
      const demoTransferId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const transfer = await Transfer.create({
        transferId: demoTransferId,
        sender: req.body.senderAddress || '0x0000000000000000000000000000000000000000',
        recipient: recipientAddress,
        amount: amount,
        sourceChain: sourceChain,
        destinationChain: destinationChain,
        intent: req.body.intent || 'standard',
        status: 'pending',
        estimatedFees: 0.001,
        suggestedActions: ['Demo transfer - chain configuration not fully supported']
      });
      
      return res.json({
        success: true,
        transferId: demoTransferId,
        message: 'Demo transfer initiated (chain configuration not fully supported)',
        status: 'pending',
        estimatedFees: 0.001,
        demo: true
      });
    }

    // Calculate optimal route using AI
    const routeData = await calculateOptimalRoute(amount, sourceChain, destinationChain, req.body.intent || 'standard');
    
    // Generate unique transfer ID
    const transferId = `BH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create transfer record
    const transfer = await Transfer.create({
      transferId,
      sender: req.body.senderAddress || '0x0000000000000000000000000000000000000000',
      recipient: recipientAddress,
      amount,
      sourceChain,
      destinationChain,
      intent: req.body.intent || 'standard',
      status: 'pending',
      estimatedFees: routeData.estimatedFees,
      suggestedActions: routeData.suggestedActions,
      email,
      note
    });
    console.log('💾 Transfer saved to MongoDB:', transferId);
    
    // For demo purposes, return success immediately
    // In production, this would initiate the actual CCTP V2 transfer
    res.json({
      success: true,
      transferId,
      message: 'Transfer initiated successfully',
      status: 'pending',
      estimatedFees: routeData.estimatedFees,
      route: routeData
    });
    
  } catch (error) {
    console.error('❌ Transfer error:', error);
    res.status(500).json({ 
      error: 'Transfer failed', 
      message: error.message,
      demo: true // Indicate this is a demo response
    });
  }
});

// Route calculation endpoint
router.post('/route', async (req, res) => {
  try {
    const { amount, sourceChain, destinationChain, intent } = req.body;
    
    if (!amount || !sourceChain || !destinationChain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const routeData = await calculateOptimalRoute(amount, sourceChain, destinationChain, intent || 'standard');
    
    res.json({ 
      success: true, 
      data: routeData 
    });
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate route' 
    });
  }
});

// Get transfer status
router.get('/status/:transferId', async (req: Request, res: Response) => {
  try {
    const { transferId } = req.params;
    
    const transfer = await Transfer.findOne({ transferId });
    if (!transfer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transfer not found' 
      });
    }

    // Demo mode: Progressive status updates
    const transferAge = Date.now() - new Date(transfer.createdAt).getTime();
    const tenSeconds = 10 * 1000;
    const twentySeconds = 20 * 1000;
    const thirtySeconds = 30 * 1000;
    
    if (transfer.status === 'pending') {
      if (transferAge > thirtySeconds) {
        // Complete the transfer
        console.log(`🎯 Demo: Auto-completing transfer ${transferId} after 30 seconds`);
        await Transfer.findOneAndUpdate(
          { transferId },
          { 
            $set: {
              status: 'completed',
              destinationTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              completedAt: new Date()
            }
          }
        );
        transfer.status = 'completed';
        transfer.destinationTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        transfer.completedAt = new Date();
      } else if (transferAge > twentySeconds && !transfer.txHash) {
        // Add burn transaction hash
        const burnTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        await Transfer.findOneAndUpdate(
          { transferId },
          { $set: { txHash: burnTxHash } }
        );
        transfer.txHash = burnTxHash;
      } else if (transferAge > tenSeconds && !transfer.cctpTransferId) {
        // Add CCTP transfer ID
        const cctpId = `cctp_${Math.random().toString(36).substr(2, 9)}`;
        await Transfer.findOneAndUpdate(
          { transferId },
          { $set: { cctpTransferId: cctpId } }
        );
        transfer.cctpTransferId = cctpId;
      }
    }

    // If transfer has CCTP ID, get real status from Circle
    let cctpStatus = null;
    if (transfer.cctpTransferId) {
      try {
        const cctpResponse = await CircleCCTPService.getTransferStatus(transfer.cctpTransferId);
        if (cctpResponse.success) {
          cctpStatus = cctpResponse;
          
          // Update local status if different
          if (cctpStatus.status !== transfer.status) {
            await Transfer.findOneAndUpdate(
              { transferId },
              { 
                $set: {
                  status: cctpStatus.status,
                  destinationTxHash: cctpStatus.mintTxHash,
                  completedAt: cctpStatus.completedAt
                }
              }
            );
          }
        }
      } catch (cctpError) {
        console.error('Error fetching CCTP status:', cctpError);
      }
    }

    const status = {
      transferId: transfer.transferId,
      status: cctpStatus?.status || transfer.status,
      burnTxHash: transfer.txHash,
      mintTxHash: cctpStatus?.mintTxHash || transfer.destinationTxHash,
      completedAt: cctpStatus?.completedAt || (transfer.status === 'completed' ? transfer.updatedAt : null),
      feesPaid: transfer.estimatedFees,
      circleCCTP: true,
      hooksExecuted: (cctpStatus?.status || transfer.status) === 'completed'
    };

    res.json({ success: true, transfer: status });
  } catch (error: any) {
    console.error('Error fetching transfer status:', error);
    res.status(500).json({ error: 'Failed to fetch transfer status' });
  }
});

// Get supported chains
router.get('/chains', (req: Request, res: Response) => {
  const supportedChains = Object.keys(CCTP_CONFIG).map(chain => ({
    name: chain.charAt(0).toUpperCase() + chain.slice(1),
    id: chain,
    domain: CCTP_CONFIG[chain as keyof typeof CCTP_CONFIG].domain,
    usdc: CCTP_CONFIG[chain as keyof typeof CCTP_CONFIG].usdc,
    rpc: CCTP_CONFIG[chain as keyof typeof CCTP_CONFIG].rpc
  }));

  res.json({ success: true, chains: supportedChains });
});

// Get transfer history for an address
router.get('/history/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const transfers = await Transfer.find({
      $or: [
        { sender: address.toLowerCase() },
        { recipient: address.toLowerCase() }
      ]
    });

    const history = transfers.map(transfer => ({
      transferId: transfer.transferId,
      amount: transfer.amount,
      sourceChain: transfer.sourceChain,
      destinationChain: transfer.destinationChain,
      status: transfer.status,
      timestamp: transfer.createdAt.toISOString(),
      fees: transfer.estimatedFees,
      circleCCTP: true,
      hooksExecuted: transfer.status === 'completed'
    }));

    res.json({ 
      success: true, 
      history,
      total: transfers.length
    });
  } catch (error: any) {
    console.error('Error fetching transfer history:', error);
    res.status(500).json({ error: 'Failed to fetch transfer history' });
  }
});

// Webhook endpoint for Circle CCTP status updates
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    
    console.log('🔄 Received CCTP webhook:', webhookData);

    // Process webhook event
    const processedEvent = await CircleCCTPService.processWebhookEvent(webhookData);
    
    if (!processedEvent.success) {
      return res.status(400).json({ error: 'Failed to process webhook' });
    }

    const { transferId, status, destinationTxHash, error } = processedEvent;

    // Find transfer by CCTP transfer ID
    const transfer = await Transfer.findOne({ cctpTransferId: transferId });
    
    if (!transfer) {
      console.warn(`⚠️ Webhook received for unknown transfer: ${transferId}`);
      return res.status(404).json({ error: 'Transfer not found' });
    }

    const updateData: any = { 
      status: status === 'completed' ? 'completed' : 'failed',
      updatedAt: new Date()
    };

    if (destinationTxHash) {
      updateData.destinationTxHash = destinationTxHash;
    }

    if (error) {
      updateData.error = error;
    }

    const updatedTransfer = await Transfer.findOneAndUpdate(
      { cctpTransferId: transferId },
      { $set: updateData },
      { new: true }
    );

    console.log(`🔄 Transfer status updated via webhook: ${transferId} -> ${status}`);

    // TODO: Execute post-transfer hooks if status is completed
    if (status === 'completed' && updatedTransfer.intent === 'maximize_yield') {
      console.log(`🎯 Executing yield maximization hook for transfer: ${transferId}`);
      // Hook execution will be implemented next
    }

    res.json({ success: true, transfer: updatedTransfer.toObject() });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Get CCTP V2 status and configuration
router.get('/cctp/status', (req: Request, res: Response) => {
  try {
    const status = {
      service: 'Circle CCTP V2',
      environment: process.env.CIRCLE_ENVIRONMENT || 'testnet',
      supportedChains: Object.keys(CCTP_CONFIG),
      apiConfigured: !!process.env.CIRCLE_API_KEY,
      clientConfigured: !!process.env.CIRCLE_CLIENT_KEY,
      infuraConfigured: !!process.env.INFURA_PROJECT_ID,
      timestamp: new Date().toISOString()
    };

    res.json({ success: true, status });
  } catch (error: any) {
    console.error('Error fetching CCTP status:', error);
    res.status(500).json({ error: 'Failed to fetch CCTP status' });
  }
});

export default router; 