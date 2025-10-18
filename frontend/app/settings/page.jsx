'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--vanilla)]">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-[var(--prussian-blue)] mb-8">
            Settings
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--prussian-blue)] mb-4">
                AI Model Settings
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-[var(--vanilla)] transition-all">
                  <input type="radio" name="ai-model" defaultChecked />
                  <div>
                    <p className="font-semibold">Gemini API</p>
                    <p className="text-sm text-gray-600">
                      Use Google's Gemini API for content generation
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-[var(--vanilla)] transition-all">
                  <input type="radio" name="ai-model" />
                  <div>
                    <p className="font-semibold">Local LLM</p>
                    <p className="text-sm text-gray-600">
                      Use a local LLM (Ollama, Mistral, etc.)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--prussian-blue)] mb-4">
                Preferences
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium">Enable notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium">Show suggestions</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium">Auto-save drafts</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </div>
          </div>

          <button className="mt-8 px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-lg transition-all">
            Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
