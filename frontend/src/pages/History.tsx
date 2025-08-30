import { motion } from 'framer-motion';
import { History as HistoryIcon, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const History = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Transfer History
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Complete history of all your BorderHop transfers across different chains. 
            Track status, view details, and analyze your remittance patterns.
          </p>
          <div className="bg-surface border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <p className="text-text-secondary mb-4">
              This page will display your complete transfer history including:
            </p>
            <ul className="text-left space-y-2 text-text-secondary">
              <li>• All completed transfers with timestamps</li>
              <li>• Transfer status and confirmation details</li>
              <li>• Source and destination chain information</li>
              <li>• Fees paid and savings achieved</li>
              <li>• Transaction hashes and explorer links</li>
              <li>• Filtering and search capabilities</li>
            </ul>
            <p className="text-sm text-text-tertiary mt-6">
              Coming soon! This feature is currently in development.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History; 