/**
 * API Client
 * Handles all API calls to the backend server
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a chat message
 * @param {string} message - User's message
 * @param {string} sessionId - Session ID for conversation tracking
 * @returns {Promise} API response
 */
export const sendMessage = async (message, sessionId) => {
  try {
    const response = await api.post('/chat', {
      message,
      sessionId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};

/**
 * Get conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise} Conversation history
 */
export const getHistory = async (sessionId) => {
  try {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get history');
  }
};

/**
 * Clear conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response
 */
export const clearHistory = async (sessionId) => {
  try {
    const response = await api.delete(`/chat/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to clear history');
  }
};

/**
 * Get top queries for analytics
 * @param {number} limit - Number of queries to return
 * @returns {Promise} Top queries
 */
export const getTopQueries = async (limit = 10) => {
  try {
    const response = await api.get(`/analytics/top-queries?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get top queries');
  }
};

export default api;



