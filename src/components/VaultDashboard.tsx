'use client';

import { useState, useEffect, useCallback } from 'react';
import { VaultItem, EncryptedVaultItem } from '@/types';
import { useAuth } from '@/lib/useAuth';
import { encryptData, decryptData } from '@/lib/encryption';
import { useClipboard } from '@/lib/useClipboard';
import { Search, Plus, Copy, Edit, Trash2, LogOut, Eye, EyeOff, ExternalLink, Check } from 'lucide-react';
import VaultItemForm from './VaultItemForm';

export default function VaultDashboard() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | undefined>();
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const { copyToClipboard, isCopied } = useClipboard();

  const fetchVaultItemsCallback = useCallback(async () => {
    try {
      const response = await fetch('/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const decryptedItems = data.items.map((encryptedItem: EncryptedVaultItem) => {
          try {
            const decryptedData = decryptData(encryptedItem.encryptedData) as VaultItem;
            return {
              _id: encryptedItem._id,
              userId: encryptedItem.userId,
              title: decryptedData.title,
              username: decryptedData.username,
              password: decryptedData.password,
              url: decryptedData.url,
              notes: decryptedData.notes,
              tags: decryptedData.tags,
              folder: decryptedData.folder,
              createdAt: encryptedItem.createdAt,
              updatedAt: encryptedItem.updatedAt,
            };
          } catch (error) {
            console.error('Failed to decrypt item:', error);
            return null;
          }
        }).filter(Boolean);
        
        setVaultItems(decryptedItems);
      }
    } catch (error) {
      console.error('Failed to fetch vault items:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      // Setup encryption key from stored salt and user's master password (if available)
      const storedSalt = localStorage.getItem('encryption_salt');
      if (storedSalt) {
        // In a real app, we'd ask the user to re-enter their master password
        // For now, we'll use the stored encryption key if available
        fetchVaultItemsCallback();
      }
    }
  }, [user, token, fetchVaultItemsCallback]);


  const handleSaveItem = async (itemData: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const encryptedData = encryptData(itemData);
      
      if (editingItem && editingItem._id) {
        // Update existing item
        const response = await fetch(`/api/vault/${editingItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ encryptedData }),
        });

        if (response.ok) {
          await fetchVaultItemsCallback();
          setShowForm(false);
          setEditingItem(undefined);
        } else {
          console.error('Failed to update item:', response.status);
        }
      } else {
        // Create new item
        const response = await fetch('/api/vault', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ encryptedData }),
        });

        if (response.ok) {
          await fetchVaultItemsCallback();
          setShowForm(false);
          setEditingItem(undefined);
        } else {
          console.error('Failed to create item:', response.status);
        }
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/vault/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await fetchVaultItemsCallback();
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleEditItem = (item: VaultItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const togglePasswordVisibility = (itemId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const filteredItems = vaultItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Password Vault
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search vault items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>

        {/* Vault Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No items found matching your search.' : 'No vault items yet. Add your first entry!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>Visit site</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id!)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {item.username && (
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Username
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {item.username}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.username)}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-900 dark:text-white font-mono">
                        {showPasswords[item._id!] ? item.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(item._id!)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPasswords[item._id!] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.password)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {item.notes && (
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Notes
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {item.notes.length > 100 ? `${item.notes.slice(0, 100)}...` : item.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <VaultItemForm
        item={editingItem}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(undefined);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}