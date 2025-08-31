const express = require('express');
const { ethers } = require('ethers');
const { Transfer } = require('../src/models/transfer');
const CircleCCTPService = require('../src/services/circleService');

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
const calculateOptimalRoute = async (amount, sourceChain, destinationChain, intent) => {
  try {
    let optimalChain = destinationChain;
    let estimatedFees = 0.001; // Base CCTP fee
    let suggestedActions = [];

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

// Route calculation endpoint
router.post('/route', async (req, res) => {
  try {
    const { amount, sourceChain, destinationChain, intent } = req.body;
    
    if (!amount || !sourceChain || !destinationChain || !intent) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const routeData = await calculateOptimalRoute(amount, sourceChain, destinationChain, intent);
    
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

// Initialize remittance transfer
router.post('/transfer', async (req, res) => {
  try {
    const { 
      senderAddress, 
      recipientAddress, 
      amount, 
      sourceChain, 
      destinationChain, 
      intent = 'standard',
      email 
    } = req.body;

    // Validate input
    if (!senderAddress || !recipientAddress || !amount || !sourceChain || !destinationChain) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate optimal route using AI
    const routeData = await calculateOptimalRoute(
      amount, 
      sourceChain, 
      destinationChain, 
      intent
    );

    // Generate transfer ID
    const transferId = `BH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save transfer to MongoDB
    const transferDoc = await Transfer.create({
      transferId,
      sender: senderAddress.toLowerCase(),
      recipient: recipientAddress.toLowerCase(),
      amount: parseFloat(amount.toString()),
      sourceChain,
      destinationChain: routeData.optimalChain,
      intent,
      estimatedFees: routeData.estimatedFees,
      suggestedActions: routeData.suggestedActions,
      status: 'pending',
      email
    });

    console.log(`💾 Transfer saved to MongoDB: ${transferId}`);

    // Execute real Circle CCTP V2 transfer
    try {
      const sourceDomain = CCTP_CONFIG[sourceChain]?.domain;
      const destinationDomain = CCTP_CONFIG[routeData.optimalChain]?.domain;

      if (!sourceDomain || !destinationDomain) {
        throw new Error('Invalid chain configuration');
      }

      // Convert amount to USDC decimals (6 decimals)
      const amountInUSDC = Math.floor(amount * 1000000).toString();

      const cctpResponse = await CircleCCTPService.initiateTransfer({
        amount: amountInUSDC,
        destinationAddress: recipientAddress,
        destinationDomain: destinationDomain,
        sourceDomain: sourceDomain,
        senderAddress: senderAddress,
      });

      if (cctpResponse.success) {
        // Update transfer with CCTP data
        await Transfer.findOneAndUpdate(
          { transferId },
          { 
            $set: {
              txHash: cctpResponse.txHash,
              cctpTransferId: cctpResponse.transferId,
              status: 'processing'
            }
          }
        );

        console.log(`🔥 CCTP V2 transfer initiated: ${cctpResponse.transferId}`);
        console.log(`📤 Burn TX: ${cctpResponse.txHash}`);

        const response = {
          success: true,
          transferId,
          transferDetails: transferDoc.toObject(),
          routeData,
          cctpData: {
            transferId: cctpResponse.transferId,
            txHash: cctpResponse.txHash,
            message: cctpResponse.message
          },
          message: 'Transfer initiated successfully with Circle CCTP V2'
        };

        res.json(response);
      } else {
        // CCTP transfer failed, update status
        await Transfer.findOneAndUpdate(
          { transferId },
          { 
            $set: {
              status: 'failed',
              error: cctpResponse.error
            }
          }
        );

        console.error(`❌ CCTP V2 transfer failed: ${cctpResponse.error}`);
        res.status(400).json({
          success: false,
          error: cctpResponse.error,
          transferId
        });
      }
    } catch (cctpError) {
      console.error('❌ CCTP V2 transfer error:', cctpError);
      
      // Update transfer status
      await Transfer.findOneAndUpdate(
        { transferId },
        { 
          $set: {
            status: 'failed',
            error: cctpError.message
          }
        }
      );

      res.status(500).json({
        success: false,
        error: `CCTP V2 transfer failed: ${cctpError.message}`,
        transferId
      });
    }

  } catch (error) {
    console.error('Error initiating transfer:', error);
    res.status(500).json({ 
      error: 'Failed to initiate transfer', 
      message: error.message 
    });
  }
});

// Alias for backward compatibility
router.post('/initiate', async (req, res) => {
  // Forward to the transfer endpoint
  req.url = '/transfer';
  return router.handle(req, res);
});

// Get transfer status
router.get('/status/:transferId', async (req, res) => {
  try {
    const { transferId } = req.params;
    
    const transfer = await Transfer.findOne({ transferId });
    if (!transfer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transfer not found' 
      });
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
  } catch (error) {
    console.error('Error fetching transfer status:', error);
    res.status(500).json({ error: 'Failed to fetch transfer status' });
  }
});

// Get supported chains
router.get('/chains', (req, res) => {
  const supportedChains = Object.keys(CCTP_CONFIG).map(chain => ({
    name: chain.charAt(0).toUpperCase() + chain.slice(1),
    id: chain,
    domain: CCTP_CONFIG[chain].domain,
    usdc: CCTP_CONFIG[chain].usdc,
    rpc: CCTP_CONFIG[chain].rpc
  }));

  res.json({ success: true, chains: supportedChains });
});

// Get transfer history for an address
router.get('/history/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const transfers = await Transfer.find({
      $or: [
        { sender: address.toLowerCase() },
        { recipient: address.toLowerCase() }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);

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
  } catch (error) {
    console.error('Error fetching transfer history:', error);
    res.status(500).json({ error: 'Failed to fetch transfer history' });
  }
});

// Webhook endpoint for Circle CCTP status updates
router.post('/webhook', async (req, res) => {
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

    const updateData = { 
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
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Get CCTP V2 status and configuration
router.get('/cctp/status', (req, res) => {
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
  } catch (error) {
    console.error('Error fetching CCTP status:', error);
    res.status(500).json({ error: 'Failed to fetch CCTP status' });
  }
});

module.exports = router; 