'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import FloatingButton from '@/components/FloatingButton';
import API_URL from '@/config/api';

export default function ChatPage() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ollama'); // 'ollama' or 'gemini'

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load chat history
    loadChats();
  }, [router]);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid, clear and redirect to login
        localStorage.clear();
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to load chats');

      const data = await response.json();
      setChats(data.chats || []);
    } catch (err) {
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove chat from list
        setChats(chats.filter(chat => chat.id !== chatId));
        // If deleted chat was current, clear selection
        if (currentChatId === chatId) {
          setCurrentChatId(null);
        }
      } else {
        console.error('Failed to delete chat');
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const handleUpdateChatTitle = async (chatId, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/${chatId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        // Update chat title in list
        setChats(chats.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        ));
      } else {
        console.error('Failed to update chat title');
      }
    } catch (err) {
      console.error('Error updating chat title:', err);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--vanilla)]">
      {/* Mobile Overlay for Sidebar */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ${
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={(chatId) => {
            handleSelectChat(chatId);
            // Auto-close sidebar on mobile after selecting chat
            if (window.innerWidth < 1024) {
              setSidebarCollapsed(true);
            }
          }}
          onNewChat={() => {
            handleNewChat();
            if (window.innerWidth < 1024) {
              setSidebarCollapsed(true);
            }
          }}
          onDeleteChat={handleDeleteChat}
          onUpdateChatTitle={handleUpdateChatTitle}
          loading={loading}
          isCollapsed={false}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Model Selection Bar */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center lg:justify-start">
            <span className="text-xs sm:text-sm font-semibold text-[var(--prussian-blue)] hidden sm:inline">AI Model:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedModel('ollama')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedModel === 'ollama'
                    ? 'bg-[var(--fire-engine-red)] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline">🦙 Ollama</span>
                <span className="sm:hidden">🦙</span>
              </button>
              <button
                onClick={() => setSelectedModel('gemini')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedModel === 'gemini'
                    ? 'bg-[var(--fire-engine-red)] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline">✨ Gemini</span>
                <span className="sm:hidden">✨</span>
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 hidden md:block">
            Using: <span className="font-semibold">{selectedModel === 'ollama' ? 'llama3.1:latest' : 'Gemini Pro'}</span>
          </div>
        </div>

        <ChatWindow
          chatId={currentChatId}
          selectedModel={selectedModel}
          onChatCreated={(id) => {
            setCurrentChatId(id);
            loadChats();
          }}
        />
      </div>

      {/* Floating Action Button - Hidden on mobile when sidebar is visible */}
      <div className={`${!sidebarCollapsed && window.innerWidth < 1024 ? 'hidden' : ''}`}>
        <FloatingButton onClick={handleNewChat} />
      </div>
    </div>
  );
}
