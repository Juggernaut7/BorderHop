import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Send, 
  Wallet, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Circle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import ChainSelector from '../ui/ChainSelector';

// Transfer form validation schema
const transferSchema = z.object({
  recipientAddress: z.string().min(42, 'Invalid Ethereum address').max(42, 'Invalid Ethereum address'),
  amount: z.number().min(0.01, 'Minimum amount is 0.01 USDC').max(1000000, 'Maximum amount is 1,000,000 USDC'),
  sourceChain: z.string().min(1, 'Please select source chain'),
  destinationChain: z.string().min(1, 'Please select destination chain'),
  intent: z.enum(['standard', 'maximize_yield', 'minimize_fees']),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  note: z.string().max(200, 'Note too long').optional().or(z.literal(''))
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSubmit: (data: TransferFormData) => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onSubmit }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeSuggestion, setRouteSuggestion] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting }
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    mode: 'onChange'
  });

  const [selectedSourceChain, setSelectedSourceChain] = useState<any>(null);
  const [selectedDestChain, setSelectedDestChain] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const watchedValues = watch();

  // Calculate optimal route using AI and real backend API
  const calculateRoute = async () => {
    if (!watchedValues.amount || !watchedValues.sourceChain || !watchedValues.destinationChain) return;

    setIsCalculating(true);
    
    try {
      // Import the API service
      const { BorderHopAPI } = await import('../../services/api');
      
      // Call real backend API
      const response = await BorderHopAPI.calculateRoute({
        amount: watchedValues.amount,
        sourceChain: watchedValues.sourceChain,
        destinationChain: watchedValues.destinationChain,
        intent: watchedValues.intent
      });

      if (response.success) {
        setRouteSuggestion(response.data);
      } else {
        console.error('Route calculation failed:', response.error);
        // Fallback to mock data for demo
        const fallbackSuggestion = {
          optimalChain: watchedValues.destinationChain,
          estimatedFees: 0.001,
          suggestedActions: [],
          gasData: { ethereum: 25, base: 0.005, arbitrum: 0.008 },
          yieldData: { ethereum: 0.045, base: 0.052, arbitrum: 0.038 }
        };
        setRouteSuggestion(fallbackSuggestion);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      // Fallback to mock data for demo
      const fallbackSuggestion = {
        optimalChain: watchedValues.destinationChain,
        estimatedFees: 0.001,
        suggestedActions: [],
        gasData: { ethereum: 25, base: 0.005, arbitrum: 0.008 },
        yieldData: { ethereum: 0.045, base: 0.052, arbitrum: 0.038 }
      };
      setRouteSuggestion(fallbackSuggestion);
    } finally {
      setIsCalculating(false);
    }
  };

  const chains = [
    { 
      id: 'ethereum', 
      name: 'Ethereum Sepolia', 
      icon: 'Ξ', 
      color: 'ethereum',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      blockExplorer: 'https://sepolia.etherscan.io'
    },
    { 
      id: 'base', 
      name: 'Base Sepolia', 
      icon: 'B', 
      color: 'base',
      rpcUrl: 'https://sepolia.base.org',
      blockExplorer: 'https://sepolia.basescan.org'
    },
    { 
      id: 'arbitrum', 
      name: 'Arbitrum Sepolia', 
      icon: 'A', 
      color: 'arbitrum',
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      blockExplorer: 'https://sepolia.arbiscan.io'
    }
  ];

  const intents = [
    {
      value: 'standard',
      label: 'Standard Transfer',
      description: 'Simple cross-chain USDC transfer',
      icon: <Send className="w-5 h-5" />,
      color: 'text-circle-600'
    },
    {
      value: 'maximize_yield',
      label: 'Maximize Yield',
      description: 'Auto-deposit to high-yield DeFi protocols',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-success-600'
    },
    {
      value: 'minimize_fees',
      label: 'Minimize Fees',
      description: 'Route through lowest-fee chains',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-warning-600'
    }
  ];

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
            Circle CCTP V2 Powered
          </span>
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
          Start Your Transfer
        </h2>
        <p className="text-neutral-600">
          Send USDC across chains with AI-powered routing and Circle's CCTP V2
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Recipient Address
          </label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              {...register('recipientAddress')}
              type="text"
              placeholder="0x1234...5678"
              className="input-field pl-10"
            />
          </div>
          {errors.recipientAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.recipientAddress.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="100.00"
              className="input-field pl-10"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Chain Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Source Chain
            </label>
            <select
              {...register('sourceChain')}
              className="input-field"
            >
              <option value="">Select source chain</option>
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
            {errors.sourceChain && (
              <p className="text-red-500 text-sm mt-1">{errors.sourceChain.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Destination Chain
            </label>
            <select
              {...register('destinationChain')}
              className="input-field"
            >
              <option value="">Select destination chain</option>
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
            {errors.destinationChain && (
              <p className="text-red-500 text-sm mt-1">{errors.destinationChain.message}</p>
            )}
          </div>
        </div>

        {/* Transfer Intent */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Transfer Intent
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {intents.map((intent) => (
              <label
                key={intent.value}
                className="relative cursor-pointer"
              >
                <input
                  {...register('intent')}
                  type="radio"
                  value={intent.value}
                  className="sr-only"
                />
                <div className={`
                  p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${watch('intent') === intent.value 
                    ? 'border-circle-500 bg-circle-50 shadow-glow' 
                    : 'border-neutral-200 hover:border-circle-300'
                  }
                `}>
                  <div className={`flex items-center gap-3 mb-2 ${intent.color}`}>
                    {intent.icon}
                    <span className="font-semibold">{intent.label}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{intent.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.intent && (
            <p className="text-red-500 text-sm mt-1">{errors.intent.message}</p>
          )}
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email (Optional)
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="input-field"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Note (Optional)
            </label>
            <input
              {...register('note')}
              type="text"
              placeholder="Transfer purpose"
              className="input-field"
            />
            {errors.note && (
              <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
            )}
          </div>
        </div>

        {/* Route Calculation */}
        {watchedValues.amount && watchedValues.sourceChain && watchedValues.destinationChain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-r from-circle-50 to-circle-100 border border-circle-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-circle-800">AI Route Optimization</h4>
              <button
                type="button"
                onClick={calculateRoute}
                disabled={isCalculating}
                className="btn-ghost text-sm"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-circle-500 border-t-transparent rounded-full animate-spin"></div>
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Calculate Route
                  </div>
                )}
              </button>
            </div>

            {routeSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Optimal Chain:</span>
                  <span className="font-medium text-circle-700">{routeSuggestion.optimalChain}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Estimated Fees:</span>
                  <span className="font-medium text-circle-700">${routeSuggestion.estimatedFees}</span>
                </div>
                {routeSuggestion.suggestedActions.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-circle-700 mb-2">Suggested Actions:</div>
                    {routeSuggestion.suggestedActions.map((action: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                        <Sparkles className="w-4 h-4 text-circle-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isValid || isCalculating}
          className={`
            w-full btn-primary text-lg py-4 flex items-center justify-center gap-3
            ${!isValid || isCalculating ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          whileHover={isValid && !isCalculating ? { scale: 1.02 } : {}}
          whileTap={isValid && !isCalculating ? { scale: 0.98 } : {}}
        >
          <Send className="w-5 h-5" />
          {isCalculating ? 'Calculating Route...' : 'Continue to Preview'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TransferForm; 