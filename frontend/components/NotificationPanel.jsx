'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationPanel({ onClose }) {
  const notifications = [
    { id: 1, text: 'New feature: AI tone presets available!', time: '2m ago' },
    { id: 2, text: 'Your draft "AI in 2024" was auto-saved', time: '1h ago' },
    { id: 3, text: 'Tip: Use /summarize for quick summaries', time: '3h ago' },
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
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[var(--fire-engine-red)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              className="p-4 bg-[var(--vanilla)] rounded-lg cursor-pointer hover:shadow-md transition-all"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-sm text-[var(--prussian-blue)] mb-1">{notif.text}</p>
              <p className="text-xs text-gray-500">{notif.time}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
