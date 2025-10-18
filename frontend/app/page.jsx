'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/chat');
    }
  }, [router]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20 gradient-bg blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-20 gradient-bg blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <span className="text-gradient">AI Content</span>
          <br />
          <span className="text-[var(--prussian-blue)]">Generator</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          Create amazing blog posts, articles, and content with AI-powered conversations.
          Your creative assistant is ready to help.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 gradient-bg text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Chatting
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-white text-[var(--prussian-blue)] rounded-xl font-semibold text-lg border-2 border-[var(--orange-wheel)] hover:bg-[var(--vanilla)] hover:scale-105 transition-all duration-300"
          >
            Sign Up Free
          </button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: '💬', title: 'Chat Interface', desc: 'Natural conversation flow' },
            { icon: '✍️', title: 'Draft Management', desc: 'Save and edit your content' },
            { icon: '🤖', title: 'AI Powered', desc: 'Gemini API & Local LLM' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--prussian-blue)]">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
