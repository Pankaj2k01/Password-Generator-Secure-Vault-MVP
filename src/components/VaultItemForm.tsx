'use client';

import { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import { X, Eye, EyeOff, Save } from 'lucide-react';
import PasswordGenerator from './PasswordGenerator';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {item ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username/Email
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGenerator(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Generate Password
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{item ? 'Update' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}