import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  ArrowRight,
  Circle,
  Zap,
  TrendingUp,
  Shield,
  RefreshCw
} from 'lucide-react';

interface TransferStatusProps {
  status: 'processing' | 'completed' | 'failed';
  message?: string;
  details?: string[];
  transferId?: string | null;
  transferStatus?: any;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }>;
}

const TransferStatus: React.FC<TransferStatusProps> = ({
  status,
  message,
  details,
  transferId,
  transferStatus,
  actions
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!transferId) return;
    try {
      await navigator.clipboard.writeText(transferId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-16 h-16 text-success-500" />;
      case 'processing':
        return <Clock className="w-16 h-16 text-circle-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-16 h-16 text-error-500" />;
      default:
        return <Clock className="w-16 h-16 text-neutral-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'completed':
        return 'Transfer Completed!';
      case 'processing':
        return 'Transfer in Progress';
      case 'failed':
        return 'Transfer Failed';
      default:
        return 'Processing Transfer';
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'completed':
        return 'Your USDC has been successfully transferred using Circle CCTP V2. The funds are now available on the destination chain.';
      case 'processing':
        return 'Your transfer is being processed through Circle\'s CCTP V2 protocol. This typically takes 2-5 minutes.';
      case 'failed':
        return 'Unfortunately, your transfer could not be completed. Please check your balance and try again.';
      default:
        return 'Processing your cross-chain transfer...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'processing':
        return 'text-circle-600 bg-circle-50 border-circle-200';
      case 'failed':
        return 'text-error-600 bg-error-50 border-error-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const steps = [
    {
      id: 'initiated',
      title: 'Transfer Initiated',
      description: 'CCTP V2 transfer request submitted',
      icon: <Circle className="w-5 h-5" />,
      status: 'completed'
    },
    {
      id: 'burning',
      title: 'USDC Burning',
      description: 'Burning USDC on source chain',
      icon: <Zap className="w-5 h-5" />,
      status: status === 'processing' ? 'current' : status === 'completed' ? 'completed' : 'pending'
    },
    {
      id: 'crosschain',
      title: 'Cross-Chain Transfer',
      description: 'CCTP V2 message transmission',
      icon: <ArrowRight className="w-5 h-5" />,
      status: status === 'processing' ? 'current' : status === 'completed' ? 'completed' : 'pending'
    },
    {
      id: 'minting',
      title: 'USDC Minting',
      description: 'Minting USDC on destination chain',
      icon: <TrendingUp className="w-5 h-5" />,
      status: status === 'processing' ? 'current' : status === 'completed' ? 'completed' : 'pending'
    },
    {
      id: 'hooks',
      title: 'Post-Transfer Hooks',
      description: 'Executing DeFi automation',
      icon: <Shield className="w-5 h-5" />,
      status: status === 'completed' ? 'completed' : 'pending'
    }
  ];

  const getStepStatus = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return 'bg-success-500 border-success-500 text-white';
      case 'current':
        return 'bg-circle-500 border-circle-500 text-white animate-pulse';
      case 'pending':
        return 'bg-neutral-200 border-neutral-300 text-neutral-400';
      default:
        return 'bg-neutral-200 border-neutral-300 text-neutral-400';
    }
  };

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'current':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-circle-50 border border-circle-200 rounded-full px-4 py-2 mb-4">
          <Circle className="w-4 h-4 text-circle-500" />
          <span className="text-sm font-medium text-circle-700">
            Circle CCTP V2
          </span>
        </div>
        
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          {getStatusIcon()}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
          {getStatusTitle()}
        </h2>
        
        <p className="text-neutral-600 mb-4">
          {getStatusMessage()}
        </p>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor()}`}>
          <span className="text-sm font-medium capitalize">
            {status}
          </span>
        </div>
      </div>

      {/* Transfer Details */}
      {transferId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Transfer Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Transfer ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-neutral-900">
                  {transferId.slice(0, 8)}...{transferId.slice(-8)}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-neutral-200 rounded transition-colors"
                  title="Copy Transfer ID"
                >
                  <Copy className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>
            
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center text-success-600 text-sm font-medium"
              >
                Transfer ID copied to clipboard!
              </motion.div>
            )}

            {transferStatus && (
              <>
                {transferStatus.burnTxHash && (
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-neutral-600">Burn Transaction</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-neutral-900">
                        {transferStatus.burnTxHash.slice(0, 8)}...{transferStatus.burnTxHash.slice(-8)}
                      </span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transferStatus.burnTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-neutral-500" />
                      </a>
                    </div>
                  </div>
                )}

                {transferStatus.mintTxHash && (
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-neutral-600">Mint Transaction</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-neutral-900">
                        {transferStatus.mintTxHash.slice(0, 8)}...{transferStatus.mintTxHash.slice(-8)}
                      </span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transferStatus.mintTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-neutral-500" />
                      </a>
                    </div>
                  </div>
                )}

                {transferStatus.feesPaid && (
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-neutral-600">Fees Paid</span>
                    <span className="text-neutral-900 font-medium">
                      ${transferStatus.feesPaid} USDC
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Network</span>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-circle-500" />
                <span className="text-neutral-900 font-medium">Circle CCTP V2</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Processing Time</span>
              <span className="text-neutral-900 font-medium">
                {status === 'completed' ? '< 5 minutes' : 'In progress...'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Details */}
      {details && details.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Transfer Progress</h3>
          
          <div className="space-y-3">
            {details.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-circle-500 rounded-full"></div>
                <span className="text-neutral-700">{detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card mb-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Transfer Progress</h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStepStatus(step.status)}`}>
                {getStepIcon(step.status)}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{step.title}</div>
                <div className="text-sm text-neutral-600">{step.description}</div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="w-px h-8 bg-neutral-200 mx-4"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {actions && actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Default Action Buttons */}
      {!actions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {status === 'completed' && (
            <>
              <button className="btn-outline flex-1 py-4 text-lg flex items-center justify-center gap-3">
                <ExternalLink className="w-5 h-5" />
                View on Explorer
              </button>
              
              <motion.button
                className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-5 h-5" />
                New Transfer
              </motion.button>
            </>
          )}

          {status === 'failed' && (
            <>
              <button className="btn-outline flex-1 py-4 text-lg">
                Try Again
              </button>
              
              <motion.button
                className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-5 h-5" />
                New Transfer
              </motion.button>
            </>
          )}

          {status === 'processing' && (
            <div className="w-full text-center">
              <div className="inline-flex items-center gap-2 text-circle-600 mb-4">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-medium">Processing...</span>
              </div>
              <p className="text-sm text-neutral-600">
                Please wait while we process your transfer. This page will update automatically.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Additional Info */}
      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-6 p-4 bg-success-50 border border-success-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-success-700">
              <div className="font-medium mb-1">Transfer Successful!</div>
              <div>
                Your USDC has been transferred using Circle's CCTP V2 protocol. 
                If you enabled post-transfer hooks, DeFi automation is now active.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {status === 'failed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-6 p-4 bg-error-50 border border-error-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-error-700">
              <div className="font-medium mb-1">Transfer Failed</div>
              <div>
                Please check your wallet balance and gas fees. If the problem persists, 
                contact support with your transfer ID.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransferStatus; 