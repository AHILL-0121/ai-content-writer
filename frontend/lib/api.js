const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
  auth: {
    signup: async (name, email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return response.json();
    },
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
  },

  chat: {
    send: async (token, chatId, message) => {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chat_id: chatId, message }),
      });
      return response.json();
    },
    getHistory: async (token) => {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    getChat: async (token, chatId) => {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    deleteChat: async (token, chatId) => {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
  },

  drafts: {
    create: async (token, title, content) => {
      const response = await fetch(`${API_BASE_URL}/drafts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      return response.json();
    },
    getAll: async (token) => {
      const response = await fetch(`${API_BASE_URL}/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    getOne: async (token, draftId) => {
      const response = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    update: async (token, draftId, title, content) => {
      const response = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      return response.json();
    },
    delete: async (token, draftId) => {
      const response = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
  },

  profile: {
    get: async (token) => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    update: async (token, name, avatarUrl) => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatar_url: avatarUrl }),
      });
      return response.json();
    },
  },
};
