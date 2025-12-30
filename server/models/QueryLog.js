/**
 * QueryLog Model
 * Tracks user queries for analytics
 * Stores query text and frequency count
 */

const mongoose = require('mongoose');

const queryLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  frequency: {
    type: Number,
    default: 1
  },
  lastAsked: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for fast query lookups
queryLogSchema.index({ query: 1 });
queryLogSchema.index({ frequency: -1 });
queryLogSchema.index({ lastAsked: -1 });

module.exports = mongoose.model('QueryLog', queryLogSchema);



