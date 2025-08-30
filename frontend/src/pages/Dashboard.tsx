import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Send, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ArrowRight,
  BarChart3,
  History,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for MVP
  const stats = {
    totalTransfers: 12,
    totalVolume: 2500,
    totalFeesSaved: 162.50,
    averageTransferSize: 208.33
  };

  const recentTransfers = [
    {
      id: 'BH_1234567890_abc123',
      amount: 500,
      sourceChain: 'ethereum',
      destinationChain: 'base',
      status: 'completed',
      timestamp: '2 hours ago',
      fees: 0.011
    },
    {
      id: 'BH_1234567890_def456',
      amount: 200,
      sourceChain: 'base',
      destinationChain: 'arbitrum',
      status: 'completed',
      timestamp: '1 day ago',
      fees: 0.009
    },
    {
      id: 'BH_1234567890_ghi789',
      amount: 1000,
      sourceChain: 'ethereum',
      destinationChain: 'base',
      status: 'completed',
      timestamp: '3 days ago',
      fees: 0.011
    }
  ];

  const quickActions = [
    {
      title: 'New Transfer',
      description: 'Send USDC across chains',
      icon: Send,
      href: '/transfer',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'View Analytics',
      description: 'Detailed performance insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'Transfer History',
      description: 'All your past transfers',
      icon: History,
      href: '/history',
      color: 'from-accent-500 to-accent-600'
    },
    {
      title: 'DeFi Hooks',
      description: 'Yield optimization tools',
      icon: Zap,
      href: '/defi',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary-50 dark:from-background dark:via-surface dark:to-primary-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-text-secondary">
            Welcome back! Here's an overview of your BorderHop activity.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Transfers',
              value: stats.totalTransfers,
              icon: Send,
              color: 'from-primary-500 to-primary-600'
            },
            {
              label: 'Total Volume',
              value: `$${stats.totalVolume.toLocaleString()}`,
              icon: DollarSign,
              color: 'from-secondary-500 to-secondary-600'
            },
            {
              label: 'Fees Saved',
              value: `$${stats.totalFeesSaved.toFixed(2)}`,
              icon: TrendingUp,
              color: 'from-accent-500 to-accent-600'
            },
            {
              label: 'Avg. Transfer',
              value: `$${stats.averageTransferSize.toFixed(2)}`,
              icon: Clock,
              color: 'from-purple-500 to-purple-600'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface border border-border rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.href}
                className="group"
              >
                <div className="bg-surface border border-border rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-text mb-2">{action.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{action.description}</p>
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Transfers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface border border-border rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text">Recent Transfers</h2>
            <Link
              to="/history"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransfers.map((transfer, index) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transfer.amount.toLocaleString()} USDC
                    </div>
                    <div className="text-sm text-gray-600">
                      {transfer.sourceChain} → {transfer.destinationChain}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 capitalize">
                    {transfer.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transfer.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 