'use client';

import { useState, useEffect, useCallback } from 'react';
import { VaultItem, EncryptedVaultItem } from '@/types';
import { useAuth } from '@/lib/useAuth';
import { encryptData, decryptData } from '@/lib/encryption';
import { useClipboard } from '@/lib/useClipboard';
import { Search, Plus, Copy, Edit, Trash2, LogOut, Eye, EyeOff, ExternalLink, Check, Shield, Lock } from 'lucide-react';
import VaultItemForm from './VaultItemForm';
import ThemeToggle from './ThemeToggle';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Header Skeleton */}
        <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-b border-white/20 dark:border-secondary-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-secondary-200 dark:bg-secondary-700 rounded-xl animate-pulse"></div>
                <div>
                  <div className="h-6 w-32 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse mb-1"></div>
                  <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <div className="h-4 w-28 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-20 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-20 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="h-12 bg-secondary-200 dark:bg-secondary-700 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-12 w-32 bg-secondary-200 dark:bg-secondary-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-secondary-700/50 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-5 bg-secondary-200 dark:bg-secondary-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                    <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="h-3 w-16 bg-secondary-200 dark:bg-secondary-700 rounded mb-1"></div>
                    <div className="h-4 w-28 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                  </div>
                  <div>
                    <div className="h-3 w-20 bg-secondary-200 dark:bg-secondary-700 rounded mb-1"></div>
                    <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-b border-white/20 dark:border-secondary-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  Password Vault
                </h1>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Secure • Encrypted • Private
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.email}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} stored
                </p>
              </div>
              <ThemeToggle />
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-error-600 dark:text-secondary-400 dark:hover:text-error-400 transition-colors duration-200 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500" size={20} />
              <input
                type="text"
                placeholder="Search your vault..."
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border border-white/20 dark:border-secondary-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 transition-all duration-200 hover:shadow-soft focus:shadow-glow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-medium hover:shadow-glow-lg transform hover:scale-[1.02]"
            >
              <Plus size={20} />
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        {/* Vault Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-secondary-500 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                {searchQuery ? 'No matches found' : 'Your vault is empty'}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6 text-balance">
                {searchQuery 
                  ? 'Try adjusting your search terms or add a new item.' 
                  : 'Start building your secure password collection by adding your first entry.'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-medium hover:shadow-glow-lg transform hover:scale-[1.02]"
                >
                  <Plus size={20} />
                  <span>Add Your First Item</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl rounded-2xl shadow-soft hover:shadow-medium border border-white/20 dark:border-secondary-700/50 p-6 transition-all duration-200 hover:transform hover:scale-[1.02] animate-slide-up"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                          {item.title}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 mt-1"
                          >
                            <span>Visit site</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                      title="Edit item"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id!)}
                      className="p-2 text-secondary-500 hover:text-error-600 dark:text-secondary-400 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-200"
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.username && (
                    <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
                          Username
                        </label>
                        <button
                          onClick={() => copyToClipboard(item.username)}
                          className="p-1.5 text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-all duration-200"
                          title="Copy username"
                        >
                          {isCopied ? <Check size={14} className="text-success-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white break-all">
                        {item.username}
                      </p>
                    </div>
                  )}

                  <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
                        Password
                      </label>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => togglePasswordVisibility(item._id!)}
                          className="p-1.5 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded transition-all duration-200"
                          title={showPasswords[item._id!] ? "Hide password" : "Show password"}
                        >
                          {showPasswords[item._id!] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="p-1.5 text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-all duration-200"
                          title="Copy password"
                        >
                          {isCopied ? <Check size={14} className="text-success-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-medium text-secondary-900 dark:text-white break-all">
                      {showPasswords[item._id!] ? (
                        <span className="text-primary-600 dark:text-primary-400">{item.password}</span>
                      ) : (
                        <span className="text-secondary-400 select-none tracking-wider">••••••••••••</span>
                      )}
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-3">
                      <label className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide block mb-2">
                        Notes
                      </label>
                      <p className="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        {item.notes.length > 120 ? (
                          <>
                            {item.notes.slice(0, 120)}
                            <span className="text-secondary-500 dark:text-secondary-400">...</span>
                          </>
                        ) : (
                          item.notes
                        )}
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