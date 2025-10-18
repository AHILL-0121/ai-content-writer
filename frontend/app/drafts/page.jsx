'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SkeletonCard from '@/components/SkeletonCard';
import API_URL from '@/config/api';

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load drafts');

      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error('Error loading drafts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this draft?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/drafts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete draft');

      setDrafts(drafts.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Error deleting draft:', err);
      alert('Failed to delete draft');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--vanilla)]">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-[var(--prussian-blue)] mb-8">
          Your Drafts
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">No drafts yet</p>
            <button
              onClick={() => router.push('/chat')}
              className="px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-lg transition-all"
            >
              Start Creating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <motion.div
                key={draft.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/drafts/${draft.id}`)}
              >
                <h3 className="text-xl font-bold text-[var(--prussian-blue)] mb-2 line-clamp-2">
                  {draft.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {draft.content}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(draft.updated_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(draft.id);
                    }}
                    className="text-[var(--fire-engine-red)] hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
