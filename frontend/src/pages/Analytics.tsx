import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Detailed insights and performance metrics for your BorderHop transfers. 
            Track savings, optimize routes, and maximize your DeFi yields.
          </p>
          <div className="bg-surface rounded-xl shadow-sm border border-border p-8 max-w-2xl mx-auto">
            <p className="text-text-secondary mb-4">
              This page will show comprehensive analytics including:
            </p>
            <ul className="text-left space-y-2 text-text-secondary">
              <li>• Transfer volume and frequency trends</li>
              <li>• Cost savings vs traditional remittances</li>
              <li>• Chain performance and gas optimization</li>
              <li>• DeFi yield optimization insights</li>
              <li>• User behavior and preferences</li>
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

export default Analytics; 