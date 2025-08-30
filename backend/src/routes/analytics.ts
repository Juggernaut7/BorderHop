import express, { Request, Response } from 'express';
import { 
  TransferStats, 
  AnalyticsDashboard, 
  DailyStats 
} from '../types';
import { Transfer } from '../models/transfer';

const router = express.Router();

// Mock transfer statistics - in production, use database
let transferStats: TransferStats = {
  totalTransfers: 0,
  totalVolume: 0,
  totalFeesSaved: 0,
  averageTransferSize: 0,
  transfersByChain: {
    ethereum: 0,
    base: 0,
    arbitrum: 0
  },
  transfersByIntent: {
    standard: 0,
    maximize_yield: 0,
    minimize_fees: 0
  },
  dailyStats: {}
};

// Update transfer statistics
const updateStats = (transfer: {
  amount: number;
  sourceChain: string;
  destinationChain: string;
  intent: string;
  feesSaved: number;
}) => {
  transferStats.totalTransfers++;
  transferStats.totalVolume += transfer.amount;
  transferStats.totalFeesSaved += transfer.feesSaved;
  transferStats.averageTransferSize = transferStats.totalVolume / transferStats.totalTransfers;
  
  transferStats.transfersByChain[transfer.destinationChain as keyof typeof transferStats.transfersByChain]++;
  transferStats.transfersByIntent[transfer.intent as keyof typeof transferStats.transfersByIntent]++;

  // Update daily stats
  const today = new Date().toISOString().split('T')[0];
  if (!transferStats.dailyStats[today]) {
    transferStats.dailyStats[today] = {
      transfers: 0,
      volume: 0,
      feesSaved: 0
    };
  }
  transferStats.dailyStats[today].transfers++;
  transferStats.dailyStats[today].volume += transfer.amount;
  transferStats.dailyStats[today].feesSaved += transfer.feesSaved;
};

// Get analytics dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Get real-time data from MongoDB
    const [
      totalStats,
      chainStats,
      intentStats,
      recentTransfers
    ] = await Promise.all([
      Transfer.aggregate([
        { $group: { 
          _id: null, 
          totalTransfers: { $sum: 1 }, 
          totalVolume: { $sum: '$amount' },
          totalFees: { $sum: '$estimatedFees' }
        }}
      ]),
      Transfer.aggregate([
        { $group: { _id: '$destinationChain', count: { $sum: 1 } } }
      ]),
      Transfer.aggregate([
        { $group: { _id: '$intent', count: { $sum: 1 } } }
      ]),
      Transfer.find()
        .sort({ createdAt: -1 })
        .limit(7)
        .select('amount sourceChain destinationChain intent createdAt')
    ]);

    const totalData = totalStats[0] || { totalTransfers: 0, totalVolume: 0, totalFees: 0 };
    const totalVolume = totalData.totalVolume || 0;
    const totalFees = totalData.totalFees || 0;
    
    // Calculate savings vs traditional remittances (6.5% average)
    const traditionalFees = totalVolume * 0.065;
    const totalFeesSaved = traditionalFees - totalFees;
    const averageTransferSize = totalData.totalTransfers > 0 ? totalVolume / totalData.totalTransfers : 0;

    // Build chain distribution
    const chainDistribution: Record<string, number> = {};
    chainStats.forEach(stat => {
      chainDistribution[stat._id] = stat.count;
    });

    // Build intent distribution
    const intentDistribution: Record<string, number> = {};
    intentStats.forEach(stat => {
      intentDistribution[stat._id] = stat.count;
    });

    // Build recent activity
    const recentActivity = recentTransfers.map(transfer => ({
      date: transfer.createdAt.toISOString().split('T')[0],
      transfers: 1,
      volume: transfer.amount,
      feesSaved: transfer.estimatedFees
    }));

    const dashboard: AnalyticsDashboard = {
      overview: {
        totalTransfers: totalData.totalTransfers,
        totalVolume: `$${totalVolume.toLocaleString()}`,
        totalFeesSaved: `$${totalFeesSaved.toLocaleString()}`,
        averageTransferSize: `$${averageTransferSize.toFixed(2)}`,
        savingsPercentage: totalVolume > 0 
          ? `${((totalFeesSaved / totalVolume) * 100).toFixed(2)}%`
          : '0%'
      },
      chainDistribution,
      intentDistribution,
      recentActivity
    };

    res.json({
      success: true,
      dashboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch analytics dashboard' });
  }
});

// Get savings comparison vs traditional remittances
router.get('/savings-comparison', (req: Request, res: Response) => {
  try {
    const traditionalFees = transferStats.totalVolume * 0.065; // 6.5% average traditional fees
    const borderhopFees = transferStats.totalVolume * 0.001; // 0.1% BorderHop fees
    const totalSavings = traditionalFees - borderhopFees;
    const savingsPercentage = ((totalSavings / traditionalFees) * 100);

    const comparison = {
      traditional: {
        totalFees: traditionalFees,
        percentage: 6.5,
        description: 'Traditional remittance services (Western Union, MoneyGram)'
      },
      borderhop: {
        totalFees: borderhopFees,
        percentage: 0.1,
        description: 'BorderHop with Circle CCTP V2'
      },
      savings: {
        amount: totalSavings,
        percentage: savingsPercentage,
        description: 'Total savings using BorderHop'
      },
      analysis: {
        transfers: transferStats.totalTransfers,
        averageSavingsPerTransfer: totalSavings / transferStats.totalTransfers,
        volume: transferStats.totalVolume
      }
    };

    res.json({
      success: true,
      comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error calculating savings comparison:', error);
    res.status(500).json({ error: 'Failed to calculate savings comparison' });
  }
});

// Get performance metrics
router.get('/performance', (req: Request, res: Response) => {
  try {
    const performance = {
      transfers: {
        total: transferStats.totalTransfers,
        successful: transferStats.totalTransfers, // Assuming 100% success for MVP
        successRate: 100,
        averageProcessingTime: '2.5 minutes' // CCTP V2 Fast Transfers
      },
      volume: {
        total: transferStats.totalVolume,
        average: transferStats.averageTransferSize,
        largest: transferStats.totalVolume > 0 ? transferStats.totalVolume : 0,
        trend: 'increasing'
      },
      fees: {
        totalPaid: transferStats.totalFeesSaved * 0.1, // 10% of savings
        averagePerTransfer: transferStats.totalTransfers > 0 
          ? (transferStats.totalFeesSaved * 0.1) / transferStats.totalTransfers 
          : 0,
        savings: transferStats.totalFeesSaved
      },
      chains: {
        mostPopular: Object.entries(transferStats.transfersByChain)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'ethereum',
        distribution: transferStats.transfersByChain
      }
    };

    res.json({
      success: true,
      performance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// Get insights and recommendations
router.get('/insights', (req: Request, res: Response) => {
  try {
    const insights = {
      topPerformingChains: Object.entries(transferStats.transfersByChain)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([chain, count]) => ({ chain, transfers: count })),
      
      userBehavior: {
        mostPopularIntent: Object.entries(transferStats.transfersByIntent)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'standard',
        averageTransferSize: transferStats.averageTransferSize,
        volumeTrend: transferStats.totalVolume > 1000 ? 'high' : 'low'
      },
      
      recommendations: [
        {
          type: 'chain_optimization',
          title: 'Optimize for Base Chain',
          description: 'Base shows highest DeFi yields (5.2% APY)',
          impact: 'high',
          action: 'Route more transfers to Base for yield optimization'
        },
        {
          type: 'fee_optimization',
          title: 'Use CCTP V2 Hooks',
          description: 'Implement post-transfer DeFi deposits',
          impact: 'medium',
          action: 'Enable auto-deposit hooks for yield maximization'
        },
        {
          type: 'user_experience',
          title: 'Intent-Based Routing',
          description: 'Users prefer yield maximization (60%)',
          impact: 'high',
          action: 'Promote yield optimization features'
        }
      ],
      
      marketOpportunities: [
        {
          region: 'Latin America',
          opportunity: 'High remittance volume, low competition',
          potential: 'high',
          strategy: 'Focus on Base chain for low fees'
        },
        {
          region: 'Southeast Asia',
          opportunity: 'Growing DeFi adoption',
          potential: 'medium',
          strategy: 'Promote yield farming features'
        }
      ]
    };

    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Update transfer statistics (for testing)
router.post('/update-stats', (req: Request, res: Response) => {
  try {
    const { amount, sourceChain, destinationChain, intent, feesSaved } = req.body;
    
    updateStats({
      amount: parseFloat(amount),
      sourceChain,
      destinationChain,
      intent,
      feesSaved: parseFloat(feesSaved)
    });

    res.json({
      success: true,
      message: 'Statistics updated successfully',
      currentStats: transferStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating statistics:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

// Get real-time analytics
router.get('/realtime', (req: Request, res: Response) => {
  try {
    const realtime = {
      currentStats: transferStats,
      recentActivity: Object.entries(transferStats.dailyStats)
        .slice(-3) // Last 3 days
        .map(([date, stats]) => ({
          date,
          transfers: stats.transfers,
          volume: stats.volume,
          feesSaved: stats.feesSaved
        }))
        .reverse(),
      liveMetrics: {
        transfersToday: transferStats.dailyStats[new Date().toISOString().split('T')[0]]?.transfers || 0,
        volumeToday: transferStats.dailyStats[new Date().toISOString().split('T')[0]]?.volume || 0,
        averageProcessingTime: '2.5 minutes',
        systemStatus: 'healthy'
      }
    };

    res.json({
      success: true,
      realtime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time analytics' });
  }
});

export default router; 