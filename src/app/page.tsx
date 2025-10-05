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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
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
