'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function SuggestionPanel({ onClose }) {
  const suggestions = [
    { id: 1, icon: '📝', text: 'How to write engaging blog intros', category: 'Writing Tips' },
    { id: 2, icon: '🎯', text: 'SEO optimization for content', category: 'SEO' },
    { id: 3, icon: '✨', text: 'Creative headline ideas', category: 'Inspiration' },
    { id: 4, icon: '📊', text: 'Content structure best practices', category: 'Structure' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--prussian-blue)]">
            Suggestions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[var(--fire-engine-red)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <motion.button
              key={suggestion.id}
              className="w-full text-left p-4 bg-gradient-to-br from-[var(--vanilla)] to-white rounded-lg hover:shadow-md transition-all border border-transparent hover:border-[var(--orange-wheel)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{suggestion.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--prussian-blue)] mb-1">
                    {suggestion.text}
                  </p>
                  <p className="text-xs text-gray-500">{suggestion.category}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
