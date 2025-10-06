'use client';

import { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import { X, Eye, EyeOff, Save, Lock } from 'lucide-react';
import PasswordGenerator from './PasswordGenerator';
import PasswordStrength from './PasswordStrength';

interface VaultItemFormProps {
  item?: VaultItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

export default function VaultItemForm({ item, isOpen, onClose, onSave }: VaultItemFormProps) {
  const [formData, setFormData] = useState<Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    tags: [],
    folder: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        username: item.username,
        password: item.password,
        url: item.url || '',
        notes: item.notes || '',
        tags: item.tags || [],
        folder: item.folder || '',
      });
    } else {
      setFormData({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
        tags: [],
        folder: '',
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePasswordGenerated = (password: string) => {
    setFormData({ ...formData, password });
    setShowGenerator(false); // Switch back to form after generating password
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-xl rounded-2xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-secondary-700/50 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
              {item ? 'Edit Entry' : 'Add New Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 p-2 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {showGenerator ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generate Password</h3>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Back to Form
                </button>
              </div>
              <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
              {formData.password && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ Password updated! Click &ldquo;Back to Form&rdquo; to continue editing.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    className="input-primary h-12 text-base placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:border-primary-400 focus:shadow-glow"
                    placeholder="e.g., Gmail, Facebook, Bank Account"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                    Username/Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="input-primary h-12 text-base placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:border-primary-400 focus:shadow-glow"
                    placeholder="Enter username or email"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGenerator(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                    >
                      Generate Strong Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      required
                      className="input-primary h-12 text-base pr-12 placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:border-primary-400 focus:shadow-glow font-mono"
                      placeholder="Enter a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <PasswordStrength password={formData.password} />
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  className="input-primary h-12 text-base placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:border-primary-400 focus:shadow-glow"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  className="input-primary text-base placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:border-primary-400 focus:shadow-glow resize-none"
                  placeholder="Add any additional notes or information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex space-x-4 pt-6 border-t border-secondary-200/50 dark:border-secondary-700/50 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-medium hover:shadow-glow-lg transform hover:scale-[1.02]"
                >
                  <Save size={18} />
                  <span>{item ? 'Update Entry' : 'Save Entry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}