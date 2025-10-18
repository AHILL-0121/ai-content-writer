'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <motion.nav
      className="bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/chat')}
            className="text-2xl font-bold text-gradient"
          >
            Chat ONN
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="text-[var(--prussian-blue)] hover:text-[var(--orange-wheel)] font-medium transition-colors"
            >
              Chat
            </button>
            <button
              onClick={() => router.push('/drafts')}
              className="text-[var(--prussian-blue)] hover:text-[var(--orange-wheel)] font-medium transition-colors"
            >
              Drafts
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="text-[var(--prussian-blue)] hover:text-[var(--orange-wheel)] font-medium transition-colors"
            >
              Settings
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold hover:shadow-lg transition-all"
            >
              U
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
