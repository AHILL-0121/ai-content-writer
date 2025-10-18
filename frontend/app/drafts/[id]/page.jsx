'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import API_URL from '@/config/api';

export default function DraftEditPage() {
  const router = useRouter();
  const params = useParams();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadDraft();
  }, [params.id]);

  const loadDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/drafts/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load draft');

      const data = await response.json();
      setDraft(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      console.error('Error loading draft:', err);
      alert('Failed to load draft');
      router.push('/drafts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/drafts/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) throw new Error('Failed to save draft');

      alert('Draft saved successfully!');
    } catch (err) {
      console.error('Error saving draft:', err);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--vanilla)]">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="skeleton h-10 w-3/4 mb-4 rounded"></div>
          <div className="skeleton h-96 w-full rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--vanilla)]">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-[var(--prussian-blue)] mb-6 border-none outline-none"
            placeholder="Draft Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 text-gray-700 border border-gray-200 rounded-lg p-4 outline-none focus:border-[var(--orange-wheel)] resize-none"
            placeholder="Start writing your content..."
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => router.push('/drafts')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Back to Drafts
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
