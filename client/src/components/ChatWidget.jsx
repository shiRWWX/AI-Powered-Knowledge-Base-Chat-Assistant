/**
 * ChatWidget Component
 * Main chat interface component with message display, input, and send functionality
 * Features: Auto-scroll, loading indicators, error handling, session-based memory
 */

import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../api';
import './ChatWidget.css';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);

    // Add user message to UI immediately
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(userMessage, sessionId);

      // Add AI response to messages
      const aiMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h2>AI Knowledge Base Assistant</h2>
        <button className="clear-btn" onClick={handleClearChat} title="Clear chat">
          Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">🤖</div>
            <h3>Welcome to AI Knowledge Base Assistant</h3>
            <p>Ask me anything about our knowledge base!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? (
            <span className="spinner">⏳</span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;



