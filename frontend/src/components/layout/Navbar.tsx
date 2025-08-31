import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  BarChart3, 
  History, 
  Send, 
  Settings,
  HelpCircle,
  User,
  LogOut,
  ChevronRight,
  Home,
  TrendingUp,
  Activity
} from 'lucide-react';
import ConnectWallet from '../wallet/ConnectWallet';
import ChainSelector from '../wallet/ChainSelector';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  // const { theme } = useTheme();
  const location = useLocation();

  // Primary navigation - essential items for navbar
  const primaryNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Transfer', href: '/transfer', icon: Send },
  ];

  // Secondary navigation - less essential items for sidebar
  const secondaryNav = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'History', href: '/history', icon: History },
    { name: 'Activity', href: '/activity', icon: Activity },
  ];

  // Utility navigation - settings, help, etc.
  const utilityNav = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleDisconnect = () => {
    disconnect();
    closeSidebar();
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Primary Nav */}
            <div className="flex items-center">
              {/* Logo with expanded space and proper styling */}
              <motion.div 
                className="flex items-center mr-12"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center group">
                  <div className="w-32 h-16 p-2 bg-surface/50 rounded-2xl border border-border/50 shadow-lg backdrop-blur-sm flex items-center justify-center">
                    <Logo size="xl" className="w-full h-full" />
                  </div>
                </Link>
              </motion.div>

              {/* Primary Navigation with clear separation */}
              <div className="hidden md:flex items-center space-x-3">
                {primaryNav.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                            : 'text-text-secondary hover:text-primary-600 hover:bg-surface/50'
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wallet Connection */}
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <ChainSelector />
                  <motion.button
                    onClick={handleDisconnect}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Disconnect</span>
                  </motion.button>
                </div>
              ) : (
                <ConnectWallet />
              )}

              {/* Sidebar Toggle */}
              <motion.button
                onClick={toggleSidebar}
                className="p-2 text-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300 lg:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              {/* Desktop Sidebar Toggle */}
              <motion.button
                onClick={toggleSidebar}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-surface border-l border-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8">
                  <Logo size="xs" />
                  <motion.button
                    onClick={closeSidebar}
                    className="p-2 text-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Secondary Navigation */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                    Main Features
                  </h3>
                  <div className="space-y-2">
                    {secondaryNav.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            onClick={closeSidebar}
                            className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              isActive(item.href)
                                ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                : 'text-text-secondary hover:text-primary-600 hover:bg-surface/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Utility Navigation */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                    Settings
                  </h3>
                  <div className="space-y-2">
                    {utilityNav.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (index + secondaryNav.length) * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            onClick={closeSidebar}
                            className="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-primary-600 hover:bg-surface/50 transition-all duration-300"
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* User Section */}
                {isConnected && (
                  <div className="border-t border-border pt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                        <p className="text-xs text-text-tertiary">Connected</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 