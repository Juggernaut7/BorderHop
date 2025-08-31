import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useChainId } from 'wagmi';
import { Circle, AlertCircle, ArrowRight, Clock, Zap, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ConnectWallet from '../components/wallet/ConnectWallet';
import TransferForm from '../components/transfer/TransferForm';
import TransferPreview from '../components/transfer/TransferPreview';
import TransferStatus from '../components/transfer/TransferStatus';
import Logo from '../components/ui/Logo';
import { chainConfig, chains } from '../config/wagmi';
import BorderHopAPI from '../services/api';

const Transfer = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'processing' | 'completed'>('form');
  const [transferData, setTransferData] = useState<any>(null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<any>(null);
  // const [isProcessing, setIsProcessing] = useState(false);

  // Get current chain info with better error handling
  const currentChain = chainId ? (chainConfig as any)[chainId] : null;
  const isSupportedChain = chainId && chains.some(chain => chain.id === chainId);

  console.log('Transfer page debug:', { chainId, currentChain, isSupportedChain, isConnected, address });

  const handleTransferSubmit = (data: any) => {
    setTransferData(data);
    setCurrentStep('preview');
  };

  const handleTransferConfirm = async () => {
    if (!address) {
      toast.error('Wallet address not found');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      // Call real backend API
      const response = await BorderHopAPI.initiateTransfer({
        senderAddress: address,
        recipientAddress: transferData.recipientAddress,
        amount: transferData.amount,
        sourceChain: transferData.sourceChain,
        destinationChain: transferData.destinationChain,
        intent: transferData.intent,
        email: transferData.email,
        note: transferData.note
      });

      if (response.success) {
        setTransferId(response.transferId);
        toast.success('Transfer initiated successfully!');
        
        // Start polling for status updates
        pollTransferStatus(response.transferId);
      } else {
        throw new Error(response.error || 'Failed to initiate transfer');
      }
    } catch (error: any) {
      console.error('Transfer initiation failed:', error);
      toast.error(error.message || 'Failed to initiate transfer');
      setCurrentStep('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollTransferStatus = async (id: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await BorderHopAPI.getTransferStatus(id);
        
        if (response.success) {
          setTransferStatus(response.transfer);
          
          if (response.transfer.status === 'completed') {
            setCurrentStep('completed');
            toast.success('Transfer completed successfully!');
            return;
          } else if (response.transfer.status === 'failed') {
            toast.error('Transfer failed');
            setCurrentStep('preview');
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          toast.error('Transfer status polling timeout');
          setCurrentStep('preview');
        }
      } catch (error) {
        console.error('Error polling transfer status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          toast.error('Transfer status polling failed');
          setCurrentStep('preview');
        }
      }
    };

    poll();
  };

  const handleNewTransfer = () => {
    setCurrentStep('form');
    setTransferData(null);
    setTransferId(null);
    setTransferStatus(null);
  };

  // If wallet is not connected, show connect screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Connect Your Wallet</h2>
          <p className="text-text-secondary mb-6">
            Please connect your wallet to start making cross-chain USDC transfers with BorderHop.
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // If connected but on unsupported network, show network switch screen
  if (!isSupportedChain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-warning-100 dark:bg-warning-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-warning-600 dark:text-warning-400" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Unsupported Network</h2>
          <p className="text-text-secondary mb-6">
            You're currently connected to an unsupported network. Please switch to one of these supported testnets:
          </p>
          <div className="space-y-3 mb-6">
            {chains.map((chain) => (
              <div key={chain.id} className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg">
                <span className="text-sm font-medium text-text">{chain.name}</span>
                <span className="text-xs text-text-tertiary">Chain ID: {chain.id}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-tertiary">
            Switch to one of these networks in your wallet to continue.
          </p>
        </div>
      </div>
    );
  }

  // If chain is supported but chainConfig is missing, show error
  if (!currentChain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-error-600 dark:text-error-400" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Configuration Error</h2>
          <p className="text-text-secondary mb-6">
            Unable to load chain configuration for network ID: {chainId}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700/30 rounded-full px-4 py-2 mb-4">
            <Circle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Circle CCTP V2 Powered
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Cross-Chain USDC Transfer
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Send USDC across multiple blockchains with AI-powered routing and Circle's CCTP V2 technology.
          </p>
        </motion.div>

        {/* Current Chain Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl shadow-lg p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">{currentChain.icon}</span>
            <span className="text-lg font-semibold text-text">{currentChain.name}</span>
          </div>
          <p className="text-sm text-text-secondary">
            Connected to {currentChain.name} • Ready for transfers
          </p>
        </motion.div>

        {/* Transfer Flow */}
        <AnimatePresence mode="wait">
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TransferForm onSubmit={handleTransferSubmit} />
            </motion.div>
          )}

          {currentStep === 'preview' && transferData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TransferPreview
                transferData={transferData}
                routeData={{
                  optimalChain: transferData.destinationChain,
                  estimatedFees: 0.001,
                  suggestedActions: transferData.intent === 'maximize_yield' 
                    ? ['Auto-deposit to high-yield DeFi protocols'] 
                    : []
                }}
                onConfirm={handleTransferConfirm}
                onBack={() => setCurrentStep('form')}
              />
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TransferStatus
                status="processing"
                message="Processing your cross-chain USDC transfer..."
                details={[
                  "Burning USDC on source chain",
                  "Waiting for CCTP confirmation",
                  "Minting USDC on destination chain",
                  "Executing post-transfer hooks"
                ]}
                transferId={transferId}
                transferStatus={transferStatus}
              />
            </motion.div>
          )}

          {currentStep === 'completed' && transferId && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TransferStatus
                status="completed"
                message="Transfer completed successfully!"
                details={[
                  `Transfer ID: ${transferId}`,
                  "USDC has been transferred across chains",
                  "Post-transfer hooks executed",
                  "You can now view your transaction history"
                ]}
                transferId={transferId}
                transferStatus={transferStatus}
                actions={[
                  {
                    label: "View on Explorer",
                    onClick: () => {
                      const txHash = transferStatus?.burnTxHash || transferStatus?.mintTxHash;
                      if (txHash) {
                        window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
                      }
                    },
                    icon: <ArrowRight className="w-4 h-4" />
                  },
                  {
                    label: "New Transfer",
                    onClick: handleNewTransfer,
                    icon: <Zap className="w-4 h-4" />
                  }
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Transfer; 