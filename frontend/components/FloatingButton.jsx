'use client';

import { motion } from 'framer-motion';

export default function FloatingButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 gradient-bg text-white rounded-full shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      +
    </motion.button>
  );
}
