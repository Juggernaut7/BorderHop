import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
  rpcUrl: string;
  blockExplorer: string;
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain | null;
  onChainSelect: (chain: Chain) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  selectedChain,
  onChainSelect,
  disabled = false,
  className = '',
  placeholder = 'Select a chain'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (chain: Chain) => {
    onChainSelect(chain);
    setIsOpen(false);
  };

  const getChainIcon = (chainId: string) => {
    switch (chainId) {
      case 'ethereum':
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Ξ</span>
          </div>
        );
      case 'base':
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
        );
      case 'arbitrum':
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-surface border border-border rounded-xl transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          hover:border-primary-300 hover:bg-surface-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between
        `}
      >
        <div className="flex items-center gap-3">
          {selectedChain ? (
            <>
              {getChainIcon(selectedChain.id)}
              <div className="text-left">
                <div className="font-medium text-text">{selectedChain.name}</div>
                <div className="text-xs text-text-secondary">{selectedChain.id}</div>
              </div>
            </>
          ) : (
            <span className="text-text-tertiary">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {chains.map((chain) => (
            <button
              key={chain.id}
              type="button"
              onClick={() => handleSelect(chain)}
              className={`
                w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-hover transition-colors
                ${selectedChain?.id === chain.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
              `}
            >
              {getChainIcon(chain.id)}
              <div className="flex-1 text-left">
                <div className="font-medium text-text">{chain.name}</div>
                <div className="text-xs text-text-secondary">{chain.id}</div>
              </div>
              {selectedChain?.id === chain.id && (
                <Check className="w-4 h-4 text-primary-500" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ChainSelector; 