'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import API_URL from '@/config/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load profile');

      const data = await response.json();
      setUser(data);
      setName(data.name);
      setAvatarUrl(data.avatar_url || '');
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatar_url: avatarUrl }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--vanilla)]">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <div className="skeleton h-32 w-32 rounded-full mx-auto mb-4"></div>
          <div className="skeleton h-10 w-full mb-4 rounded"></div>
          <div className="skeleton h-10 w-full rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--vanilla)]">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-[var(--prussian-blue)] mb-8 text-center">
            Profile Settings
          </h1>

          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--orange-wheel)] to-[var(--fire-engine-red)] flex items-center justify-center text-white text-4xl font-bold">
              {name ? name[0].toUpperCase() : 'U'}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--orange-wheel)]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--orange-wheel)]"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-[var(--fire-engine-red)] text-white rounded-lg hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
