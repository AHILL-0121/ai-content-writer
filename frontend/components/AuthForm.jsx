'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuthForm({ type, onSubmit, loading, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'signup') {
      onSubmit(email, password, name);
    } else {
      onSubmit(email, password);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg space-y-3 sm:space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
          {error}
        </div>
      )}

      {type === 'signup' && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--orange-wheel)] transition-all"
            placeholder="John Doe"
          />
        </div>
      )}

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--orange-wheel)] transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--orange-wheel)] transition-all"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Please wait...' : type === 'signup' ? 'Sign Up' : 'Log In'}
      </button>
    </motion.form>
  );
}
