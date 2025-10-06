'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { generateEncryptionKey, setEncryptionKey } from '@/lib/encryption';
import AuthForm from '@/components/AuthForm';
import VaultDashboard from '@/components/VaultDashboard';

export default function Home() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();

  useEffect(() => {
    // Setup encryption key when user logs in
    if (user) {
      const storedSalt = localStorage.getItem('encryption_salt');
      if (storedSalt) {
        // In a real app, we'd prompt the user for their master password
        // For demo purposes, we'll use a derived key from their email
        const masterPassword = localStorage.getItem('temp_master_password') || user.email;
        const encKey = generateEncryptionKey(masterPassword, storedSalt);
        setEncryptionKey(encKey);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 shadow-glow animate-pulse">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Loading Your Vault</h3>
          <p className="text-secondary-600 dark:text-secondary-400 animate-pulse-gentle">Preparing your secure environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />
    );
  }

  return <VaultDashboard />;
}
