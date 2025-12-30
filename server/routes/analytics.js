/**
 * Analytics Route
 * Provides endpoints for query analytics and statistics
 */

const express = require('express');
const router = express.Router();
const QueryLog = require('../models/QueryLog');

/**
 * GET /api/analytics/top-queries
 * Get top queries by frequency
 * Query params: limit (default: 10)
 */
router.get('/top-queries', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topQueries = await QueryLog.find()
      .sort({ frequency: -1, lastAsked: -1 })
      .limit(limit)
      .select('query frequency lastAsked createdAt')
      .lean();

    res.json({
      success: true,
      count: topQueries.length,
      queries: topQueries
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics', 
      message: error.message 
    });
  }
});

/**
 * GET /api/analytics/stats
 * Get overall statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalQueries = await QueryLog.countDocuments();
    const uniqueQueries = await QueryLog.distinct('query').then(queries => queries.length);
    const totalFrequency = await QueryLog.aggregate([
      { $group: { _id: null, total: { $sum: '$frequency' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalQueries: totalQueries,
        uniqueQueries: uniqueQueries,
        totalFrequency: totalFrequency[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats', 
      message: error.message 
    });
  }
});

module.exports = router;



