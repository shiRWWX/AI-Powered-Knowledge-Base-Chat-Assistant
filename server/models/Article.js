/**
 * Article Model
 * Represents knowledge base articles stored in MongoDB
 * Includes text indexing for fast search functionality
 */

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index on title and content for full-text search
articleSchema.index({ title: 'text', content: 'text' });

// Compound index for better search performance
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);



