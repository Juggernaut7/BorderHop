import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chainConfig } from '../../config/wagmi';

const ChainSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const supportedChains = Object.entries(chainConfig).map(([id, chain]) => ({ ...chain, id: parseInt(id) }));

  const currentChain = chain ? (chainConfig as any)[chain.id] : null;

  const handleSwitchChain = (targetChainId: number) => {
    switchChain?.({ chainId: targetChainId });
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!currentChain) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-yellow-700">Unsupported Network</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        disabled={isPending}
      >
        <span className="text-2xl">{currentChain.icon}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {currentChain.shortName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Select Network</h3>
              <p className="text-sm text-gray-600">Choose your preferred blockchain network</p>
            </div>

            <div className="py-2">
              {supportedChains.map((chainInfo) => {
                const isCurrentChain = currentChain.name === chainInfo.name;
                return (
                  <button
                    key={chainInfo.name}
                    onClick={() => handleSwitchChain(chainInfo.id)}
                    disabled={isCurrentChain || isPending}
                    className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center space-x-3 ${
                      isCurrentChain
                        ? 'bg-primary-50 text-primary-700 cursor-default'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{chainInfo.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{chainInfo.name}</div>
                      <div className="text-sm text-gray-600">
                        {chainInfo.nativeCurrency.symbol} • {chainInfo.shortName}
                      </div>
                    </div>
                    {isCurrentChain && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
              <p className="text-xs text-gray-500 text-center">
                Switching networks may require wallet approval
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChainSelector; 