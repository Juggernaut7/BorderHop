import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Info,
  Circle,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const safeToFixed = (value: any, decimals: number = 2): string => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toFixed(decimals);
  }
  return '0'.padEnd(decimals + 1, '0');
};

interface TransferPreviewProps {
  transferData: {
    recipientAddress: string;
    amount: number;
    sourceChain: string;
    destinationChain: string;
    intent: string;
    email?: string;
    note?: string;
  };
  routeData: {
    optimalChain: string;
    estimatedFees: number;
    suggestedActions: string[];
  };
  onConfirm: () => void;
  onBack: () => void;
}

const TransferPreview: React.FC<TransferPreviewProps> = ({
  transferData,
  routeData,
  onConfirm,
  onBack
}) => {
  const getChainIcon = (chain: string) => {
    const icons: Record<string, string> = {
      ethereum: '🔵',
      base: '🔷',
      arbitrum: '🔶'
    };
    return icons[chain] || '⛓️';
  };

  const getChainName = (chain: string) => {
    const names: Record<string, string> = {
      ethereum: 'Ethereum Sepolia',
      base: 'Base Sepolia',
      arbitrum: 'Arbitrum Sepolia'
    };
    return names[chain] || chain;
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'maximize_yield':
        return <TrendingUp className="w-5 h-5 text-success-500" />;
      case 'minimize_fees':
        return <DollarSign className="w-5 h-5 text-warning-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-circle-500" />;
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'maximize_yield':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'minimize_fees':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      default:
        return 'text-circle-600 bg-circle-50 border-circle-200';
    }
  };

  const getIntentLabel = (intent: string) => {
    switch (intent) {
      case 'maximize_yield':
        return 'Maximize Yield';
      case 'minimize_fees':
        return 'Minimize Fees';
      default:
        return 'Standard Transfer';
    }
  };

  const calculateSavings = () => {
    // Traditional remittance fees are typically 6-7%
    const traditionalFees = transferData.amount * 0.065;
    const savings = traditionalFees - routeData.estimatedFees;
    const savingsPercentage = (savings / traditionalFees) * 100;
    return { traditionalFees, savings, savingsPercentage };
  };

  const savings = calculateSavings();
  const { savingsPercentage } = savings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700/30 rounded-full px-4 py-2 mb-4">
          <Circle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Transfer Preview
          </span>
        </div>
        <h2 className="text-3xl font-bold text-text mb-2">
          Review Your Transfer
        </h2>
        <p className="text-text-secondary">
          Confirm the details before executing with Circle CCTP V2
        </p>
      </div>

      <div className="space-y-6">
        {/* Transfer Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface border border-border rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Transfer Summary</h3>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Circle className="w-5 h-5" />
              <span className="text-sm font-medium">CCTP V2</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Amount and Chain */}
            <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  ${safeToFixed(transferData.amount, 2).split('.')[0]}
                </div>
                <div>
                  <div className="font-semibold text-text">
                    {safeToFixed(transferData.amount, 2)} USDC
                  </div>
                  <div className="text-sm text-text-secondary">Transfer Amount</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Processing Time</div>
                <div className="font-semibold text-success-600 dark:text-success-400">&lt; 5 minutes</div>
              </div>
            </div>

            {/* Chain Route */}
            <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getChainIcon(transferData.sourceChain)}</span>
                  <div>
                    <div className="font-medium text-text">{getChainName(transferData.sourceChain)}</div>
                    <div className="text-sm text-text-secondary">Source</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <ArrowRight className="w-5 h-5" />
                <Circle className="w-4 h-4" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium text-text">{getChainName(routeData.optimalChain)}</div>
                    <div className="text-sm text-text-secondary">Destination</div>
                  </div>
                  <span className="text-2xl">{getChainIcon(routeData.optimalChain)}</span>
                </div>
              </div>
            </div>

            {/* Intent */}
            <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl">
              <div className="flex items-center gap-3">
                {getIntentIcon(transferData.intent)}
                <div>
                  <div className="font-medium text-text">{getIntentLabel(transferData.intent)}</div>
                  <div className="text-sm text-text-secondary">Transfer Intent</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntentColor(transferData.intent)}`}>
                {getIntentLabel(transferData.intent)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fee Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Fee Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-circle-500" />
                <span className="text-neutral-600">CCTP V2 Fee</span>
              </div>
              <span className="font-medium text-neutral-900">$0.001</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-600">Gas Fee (Estimated)</span>
              </div>
              <span className="font-medium text-neutral-900">${typeof routeData.estimatedFees === 'number' ? (routeData.estimatedFees - 0.001).toFixed(3) : '0.000'}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-success-700 font-medium">Total Fees</span>
              </div>
              <span className="font-bold text-success-700">${safeToFixed(routeData.estimatedFees, 3)}</span>
            </div>
          </div>

          {/* Savings Comparison */}
          <div className="mt-4 p-4 bg-gradient-to-r from-circle-50 to-blue-50 border border-circle-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-circle-700">vs Traditional Remittances</span>
              <span className="text-sm text-neutral-600">6.5% average</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">You Save:</span>
              <span className="font-bold text-success-600">
                ${safeToFixed(savings.savings, 2)} ({safeToFixed(savings.savingsPercentage, 1)}%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Suggested Actions */}
        {routeData.suggestedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card bg-gradient-to-r from-circle-50 to-circle-100 border-circle-200"
          >
            <h3 className="text-lg font-semibold text-circle-800 mb-4">AI Suggestions</h3>
            <div className="space-y-3">
              {routeData.suggestedActions.map((action, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-circle-500 rounded-full"></div>
                  <span className="text-circle-700">{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recipient Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recipient Details</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Address</span>
              <span className="font-mono text-sm text-neutral-900">
                {transferData.recipientAddress.slice(0, 6)}...{transferData.recipientAddress.slice(-4)}
              </span>
            </div>
            
            {transferData.email && (
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600">Email</span>
                <span className="text-neutral-900">{transferData.email}</span>
              </div>
            )}
            
            {transferData.note && (
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600">Note</span>
                <span className="text-neutral-900">{transferData.note}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onBack}
            className="btn-outline flex-1 py-4 text-lg"
          >
            Back to Form
          </button>
          
          <motion.button
            onClick={onConfirm}
            className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Transfer
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <div className="font-medium mb-1">Security Notice</div>
              <div>
                This transfer will be executed using Circle's CCTP V2 protocol, ensuring secure, 
                non-custodial cross-chain transfers. Your funds remain in your control throughout the process.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransferPreview; 