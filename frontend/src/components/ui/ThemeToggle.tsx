import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-200/20 dark:border-primary-700/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-6 h-6"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === 'light' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-6 h-6 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-6 h-6 text-blue-400" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: theme === 'dark' 
            ? "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Sparkle effect on hover */}
      <motion.div
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-4 h-4 text-primary-500" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 