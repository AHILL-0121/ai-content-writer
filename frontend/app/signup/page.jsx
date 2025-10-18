'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthForm from '@/components/AuthForm';
import API_URL from '@/config/api';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (email, password, name) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to chat
      router.push('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-[var(--vanilla)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">Get Started</h1>
          <p className="text-sm sm:text-base text-gray-600">Create your free account</p>
        </div>

        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          loading={loading}
          error={error}
        />

        <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-[var(--fire-engine-red)] font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </motion.div>
    </div>
  );
}
