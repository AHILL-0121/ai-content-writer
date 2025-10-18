'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import API_URL from '@/config/api';

export default function ChatWindow({ chatId, selectedModel, onChatCreated }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      loadChat();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChat = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Failed to load chat');

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    setSending(true);

    // Add user message immediately
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId || null,
          message,
          model: selectedModel, // Pass selected model to backend
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      // If new chat was created, notify parent
      if (!chatId && data.chat_id) {
        onChatCreated(data.chat_id);
      }

      // Add AI response
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (messages.length === 0) {
      alert('No messages to save');
      return;
    }

    const content = messages
      .filter((m) => m.role === 'assistant')
      .map((m) => m.content)
      .join('\n\n');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: messages[0]?.content.substring(0, 50) + '...',
          content,
        }),
      });

      if (!response.ok) throw new Error('Failed to save draft');

      alert('Draft saved successfully!');
    } catch (err) {
      console.error('Error saving draft:', err);
      alert('Failed to save draft');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--vanilla)] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--prussian-blue)]">
          {chatId ? 'Chat' : 'New Chat'}
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          {messages.length > 0 && (
            <button
              onClick={handleSaveDraft}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[var(--xanthous)] text-[var(--prussian-blue)] rounded-lg text-xs sm:text-sm font-medium hover:shadow-md transition-all"
            >
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">💾</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-h-0">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="skeleton h-20 w-3/4 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <div className="text-4xl sm:text-6xl mb-4">💬</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--prussian-blue)] mb-2">
                Start a Conversation
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Ask me anything about content creation!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-[var(--vanilla)] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[var(--orange-wheel)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--orange-wheel)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[var(--orange-wheel)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
}
