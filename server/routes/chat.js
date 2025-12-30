/**
 * Chat Route
 * Handles chat requests, searches knowledge base, and generates AI responses
 * Maintains conversation history and logs queries for analytics
 */

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Article = require('../models/Article');
const QueryLog = require('../models/QueryLog');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory conversation history storage (in production, use Redis or database)
const conversationHistory = new Map();

/**
 * POST /api/chat
 * Handles chat messages from the frontend
 */
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Message and sessionId are required' 
      });
    }

    // Get or initialize conversation history for this session
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Log the query for analytics
    await logQuery(message);

    // Search knowledge base for relevant articles
    const relevantArticles = await searchKnowledgeBase(message);
    
    // Build context from relevant articles
    const context = buildContext(relevantArticles);

    // Prepare system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant that answers questions based on the provided knowledge base. 
      Use only the information from the knowledge base context below to answer questions. 
      If the answer is not in the knowledge base, politely say that you don't have that information.
      
      Knowledge Base Context:
      ${context}`
    };

    // Prepare messages for OpenAI (system message + conversation history)
    const messages = [systemMessage, ...history.slice(-10)]; // Keep last 10 messages for context

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });

    // Return response
    res.json({
      response: aiResponse,
      sessionId: sessionId,
      relevantArticles: relevantArticles.map(article => ({
        title: article.title,
        id: article._id
      }))
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message', 
      message: error.message 
    });
  }
});

/**
 * Search knowledge base for relevant articles
 */
async function searchKnowledgeBase(query) {
  try {
    // Use MongoDB text search
    const articles = await Article.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5); // Get top 5 most relevant articles

    // If text search doesn't return results, try a broader search
    if (articles.length === 0) {
      const fallbackArticles = await Article.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ]
      }).limit(3);
      return fallbackArticles;
    }

    return articles;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Build context string from relevant articles
 */
function buildContext(articles) {
  if (articles.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  return articles.map((article, index) => {
    return `[Article ${index + 1}]
Title: ${article.title}
Content: ${article.content.substring(0, 1000)}${article.content.length > 1000 ? '...' : ''}
`;
  }).join('\n\n');
}

/**
 * Log query for analytics
 */
async function logQuery(query) {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    
    const queryLog = await QueryLog.findOne({ query: normalizedQuery });
    
    if (queryLog) {
      // Update frequency and lastAsked
      queryLog.frequency += 1;
      queryLog.lastAsked = new Date();
      await queryLog.save();
    } else {
      // Create new query log entry
      await QueryLog.create({
        query: normalizedQuery,
        frequency: 1
      });
    }
  } catch (error) {
    console.error('Query logging error:', error);
    // Don't fail the request if logging fails
  }
}

/**
 * GET /api/chat/history/:sessionId
 * Get conversation history for a session
 */
router.get('/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversationHistory.get(sessionId) || [];
  res.json({ history });
});

/**
 * DELETE /api/chat/history/:sessionId
 * Clear conversation history for a session
 */
router.delete('/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversationHistory.delete(sessionId);
  res.json({ message: 'Conversation history cleared' });
});

module.exports = router;



