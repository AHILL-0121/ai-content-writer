'use client';

import { useState } from 'react';

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-6 bg-[var(--vanilla)] border-t border-gray-200 flex-shrink-0">
      <div className="flex gap-2 sm:gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl border-2 border-transparent focus:border-[var(--orange-wheel)] outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-4 sm:px-8 py-3 sm:py-4 gradient-bg text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <span className="hidden sm:inline">Send</span>
          <span className="sm:hidden">📤</span>
        </button>
      </div>
    </form>
  );
}
