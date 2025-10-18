'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ChatSidebar({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat, onUpdateChatTitle, loading, isCollapsed, onToggleCollapse }) {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title || 'Untitled Chat');
  };

  const handleSaveEdit = async (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      await onUpdateChatTitle(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      await onDeleteChat(chatId);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--prussian-blue)] text-[var(--vanilla)] p-6 overflow-y-auto w-80 h-full">
        <div className="skeleton h-10 w-full mb-4 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-16 w-full mb-2 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[var(--prussian-blue)] text-[var(--vanilla)] flex flex-col w-80 h-full">
      {/* Toggle Button - Desktop only */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-4 top-6 z-10 w-8 h-8 bg-[var(--fire-engine-red)] text-white rounded-full items-center justify-center hover:bg-[var(--orange-wheel)] transition-colors shadow-lg"
        title="Hide sidebar"
      >
        ←
      </button>

      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--xanthous)]">Chat ONN</h2>
          {/* Close button for mobile */}
          <button
            onClick={onToggleCollapse}
            className="lg:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-4 sm:px-6 pb-4">
          <button
            onClick={onNewChat}
            className="w-full px-4 py-3 gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
          <h3 className="text-sm font-semibold text-[var(--xanthous)] mb-3">Recent Chats</h3>
          {chats.length === 0 ? (
            <p className="text-sm text-gray-400">No chats yet</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  className={`w-full text-left rounded-lg transition-all group ${
                    currentChatId === chat.id
                      ? 'bg-[var(--fire-engine-red)] text-white'
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingChatId === chat.id ? (
                    <div className="p-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm bg-white bg-opacity-20 rounded border border-white border-opacity-30 focus:outline-none focus:border-opacity-60 text-white"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(chat.id, e);
                          if (e.key === 'Escape') handleCancelEdit(e);
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveEdit(chat.id, e)}
                        className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 rounded"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 rounded"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onSelectChat(chat.id)}
                      className="p-3 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm sm:text-base">{chat.title || 'Untitled Chat'}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleStartEdit(chat, e)}
                          className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded text-sm"
                          title="Edit title"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleDelete(chat.id, e)}
                          className="p-1.5 hover:bg-red-500 hover:bg-opacity-80 rounded text-sm"
                          title="Delete chat"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
