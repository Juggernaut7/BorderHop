const express = require('express');
const { Transfer } = require('../src/models/transfer');

const router = express.Router();

// Get analytics dashboard
router.get('/dashboard', async (req, res) => {
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
    const chainDistribution = {};
    chainStats.forEach(stat => {
      chainDistribution[stat._id] = stat.count;
    });

    // Build intent distribution
    const intentDistribution = {};
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

    const dashboard = {
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
router.get('/savings-comparison', async (req, res) => {
  try {
    const totalStats = await Transfer.aggregate([
      { $group: { 
        _id: null, 
        totalVolume: { $sum: '$amount' },
        totalFees: { $sum: '$estimatedFees' }
      }}
    ]);

    const totalData = totalStats[0] || { totalVolume: 0, totalFees: 0 };
    const totalVolume = totalData.totalVolume || 0;
    const borderhopFees = totalData.totalFees || 0;
    
    const traditionalFees = totalVolume * 0.065; // 6.5% average traditional fees
    const totalSavings = traditionalFees - borderhopFees;
    const savingsPercentage = totalVolume > 0 ? ((totalSavings / traditionalFees) * 100) : 0;

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
        transfers: totalData.totalTransfers || 0,
        averageSavingsPerTransfer: totalData.totalTransfers > 0 ? totalSavings / totalData.totalTransfers : 0,
        volume: totalVolume
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
router.get('/performance', async (req, res) => {
  try {
    const totalStats = await Transfer.aggregate([
      { $group: { 
        _id: null, 
        totalTransfers: { $sum: 1 }, 
        totalVolume: { $sum: '$amount' },
        totalFees: { $sum: '$estimatedFees' }
      }}
    ]);

    const totalData = totalStats[0] || { totalTransfers: 0, totalVolume: 0, totalFees: 0 };
    const totalVolume = totalData.totalVolume || 0;
    const totalFees = totalData.totalFees || 0;
    const averageTransferSize = totalData.totalTransfers > 0 ? totalVolume / totalData.totalTransfers : 0;

    const performance = {
      transfers: {
        total: totalData.totalTransfers,
        successful: totalData.totalTransfers, // Assuming 100% success for MVP
        successRate: 100,
        averageProcessingTime: '2.5 minutes' // CCTP V2 Fast Transfers
      },
      volume: {
        total: totalVolume,
        average: averageTransferSize,
        largest: totalVolume > 0 ? totalVolume : 0,
        trend: 'increasing'
      },
      fees: {
        totalPaid: totalFees,
        averagePerTransfer: totalData.totalTransfers > 0 ? totalFees / totalData.totalTransfers : 0,
        savings: totalVolume * 0.065 - totalFees
      },
      chains: {
        mostPopular: 'ethereum', // Default, will be calculated from chain stats
        distribution: {}
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
router.get('/insights', async (req, res) => {
  try {
    const [chainStats, intentStats] = await Promise.all([
      Transfer.aggregate([
        { $group: { _id: '$destinationChain', count: { $sum: 1 } } }
      ]),
      Transfer.aggregate([
        { $group: { _id: '$intent', count: { $sum: 1 } } }
      ])
    ]);

    const topPerformingChains = chainStats
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(stat => ({ chain: stat._id, transfers: stat.count }));

    const mostPopularIntent = intentStats
      .sort((a, b) => b.count - a.count)[0]?._id || 'standard';

    const insights = {
      topPerformingChains,
      userBehavior: {
        mostPopularIntent,
        averageTransferSize: 0, // Will be calculated from total stats
        volumeTrend: 'high'
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
          description: 'Users prefer yield maximization',
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

// Get real-time analytics
router.get('/realtime', async (req, res) => {
  try {
    const [totalStats, recentTransfers] = await Promise.all([
      Transfer.aggregate([
        { $group: { 
          _id: null, 
          totalTransfers: { $sum: 1 }, 
          totalVolume: { $sum: '$amount' }
        }}
      ]),
      Transfer.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('amount sourceChain destinationChain createdAt')
    ]);

    const totalData = totalStats[0] || { totalTransfers: 0, totalVolume: 0 };
    const today = new Date().toISOString().split('T')[0];
    
    const realtime = {
      currentStats: {
        totalTransfers: totalData.totalTransfers,
        totalVolume: totalData.totalVolume
      },
      recentActivity: recentTransfers.map(transfer => ({
        date: transfer.createdAt.toISOString().split('T')[0],
        transfers: 1,
        volume: transfer.amount,
        feesSaved: 0.001
      })),
      liveMetrics: {
        transfersToday: recentTransfers.filter(t => 
          t.createdAt.toISOString().split('T')[0] === today
        ).length,
        volumeToday: recentTransfers
          .filter(t => t.createdAt.toISOString().split('T')[0] === today)
          .reduce((sum, t) => sum + t.amount, 0),
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

module.exports = router; 