import { useState, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Check, Sparkles, Zap, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ConnectWallet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, connectors, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { theme } = useTheme();
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);

  // Detect installed wallets
  useEffect(() => {
    const wallets = [];
    
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check for specific wallet providers
      if (window.ethereum.isMetaMask) wallets.push('MetaMask');
      if (window.ethereum.isRabby) wallets.push('Rabby');
      if (window.ethereum.isTrust) wallets.push('Trust Wallet');
      if (window.ethereum.isCoinbaseWallet) wallets.push('Coinbase Wallet');
      if (window.ethereum.isBraveWallet) wallets.push('Brave Wallet');
      
      // If no specific wallet detected but ethereum is available, it's likely a generic injected wallet
      if (wallets.length === 0 && window.ethereum) {
        wallets.push('Browser Wallet');
      }
    }
    
    setDetectedWallets(wallets);
    console.log('Detected wallets:', wallets);
  }, []);

  const walletOptions = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      description: 'Connect with MetaMask',
      icon: '🦊',
      connector: connectors.find(c => c.id === 'metaMask'),
      color: 'from-orange-500 to-yellow-500',
      url: 'https://metamask.io/download/',
      isDetected: detectedWallets.includes('MetaMask'),
    },
    {
      id: 'injected',
      name: 'Browser Wallet',
      description: 'Connect with browser wallet (Rabby, Trust, etc.)',
      icon: '🌐',
      connector: connectors.find(c => c.id === 'injected'),
      color: 'from-blue-500 to-cyan-500',
      url: null,
      isDetected: detectedWallets.includes('Rabby') || detectedWallets.includes('Trust Wallet') || detectedWallets.includes('Browser Wallet'),
    },
  ];

  // Improved connection handler
  const handleConnect = async (connector: any) => {
    console.log('Attempting to connect with:', connector);
    
    if (connector && connector.ready) {
      try {
        console.log('Connector is ready, connecting...');
        await connect({ connector });
        console.log('Connection successful!');
        setIsOpen(false);
      } catch (err) {
        console.error('Connection error:', err);
      }
    } else {
      console.log('Connector not ready:', connector);
      // Try to connect anyway for injected wallets
      if (connector?.id === 'injected') {
        try {
          console.log('Attempting injected connection...');
          await connect({ connector });
          console.log('Injected connection successful!');
          setIsOpen(false);
        } catch (err) {
          console.error('Injected connection error:', err);
        }
      }
    }
  };

  const handleDownloadWallet = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const toggleDropdown = () => {
    console.log('Toggle dropdown clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  // Check if any wallets are available
  const availableWallets = walletOptions.filter(option => 
    option.connector?.ready || option.isDetected
  );
  
  const unavailableWallets = walletOptions.filter(option => 
    !option.connector?.ready && !option.isDetected
  );

  console.log('Available wallets:', availableWallets);
  console.log('Unavailable wallets:', unavailableWallets);
  console.log('All connectors:', connectors);

  // If wallet is connected, show different button
  if (isConnected && address) {
    return (
      <div className="relative">
        <motion.button
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Wallet className="w-5 h-5" />
          <span>Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Connect Wallet Button */}
      <motion.button
        onClick={toggleDropdown}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        
        <motion.div
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 z-50 overflow-hidden max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"
              >
                <Zap className="w-5 h-5 text-blue-500" />
                Connect Wallet
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              >
                Choose your preferred wallet to connect
              </motion.p>
            </div>

            {/* Available Wallets */}
            {availableWallets.length > 0 && (
              <div className="py-2">
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Available Wallets
                </div>
                {availableWallets.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleConnect(option.connector)}
                    className="group w-full px-6 py-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-4 relative overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="text-3xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      {option.icon}
                    </motion.div>
                    
                    <div className="flex-1 relative z-10">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                        {option.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        {option.description}
                      </div>
                    </div>
                    
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Check className="w-5 h-5 text-blue-600" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Unavailable Wallets */}
            {unavailableWallets.length > 0 && (
              <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Install Wallets
                </div>
                {unavailableWallets.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => option.url && handleDownloadWallet(option.url)}
                    className="group w-full px-6 py-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-4 relative overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="text-3xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      {option.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                        {option.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        {option.description}
                      </div>
                    </div>
                    
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Download className="w-5 h-5 text-blue-600" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No wallets available */}
            {availableWallets.length === 0 && unavailableWallets.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-6 py-4 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No compatible wallets found. Please install MetaMask or another supported wallet.
                </p>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800"
              >
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error: {error.message || 'Failed to connect wallet'}
                </p>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ConnectWallet; 