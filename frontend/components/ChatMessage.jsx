'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [copiedCode, setCopiedCode] = useState(null);

  // Parse message content to separate text and code blocks
  const parseContent = (content) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  // Parse bold text within a text part
  const renderTextWithBold = (text) => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add regular text before bold
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      // Add bold text
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold">{match[1]}</strong>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${key++}`}>{text.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : text;
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const parts = parseContent(message.content);

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[95%] sm:max-w-[85%] lg:max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {parts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <div key={index} className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="flex justify-between items-center px-3 sm:px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs text-gray-400 font-mono tracking-wide uppercase">{part.language}</span>
                  <button
                    onClick={() => copyToClipboard(part.content, index)}
                    className="text-xs px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors font-sans"
                  >
                    {copiedCode === index ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto">
                  <code className="text-[13px] sm:text-[14px] leading-6 text-gray-100 font-mono">{part.content}</code>
                </pre>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ${
                  isUser
                    ? 'gradient-bg text-white rounded-br-none'
                    : 'bg-[var(--vanilla)] text-[var(--prussian-blue)] rounded-bl-none'
                }`}
              >
                <p className="text-[14px] sm:text-[15px] leading-6 sm:leading-7 whitespace-pre-wrap break-words font-sans">
                  {renderTextWithBold(part.content)}
                </p>
                <p className={`text-xs mt-2 font-sans ${isUser ? 'text-white opacity-70' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            );
          }
        })}
      </div>
    </motion.div>
  );
}
