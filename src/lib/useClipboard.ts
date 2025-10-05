'use client';

import { useState, useCallback } from 'react';

export function useClipboard(clearAfterMs: number = 15000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Clear clipboard after specified time
      setTimeout(() => {
        navigator.clipboard.writeText('').catch(() => {
          // Ignore errors when clearing clipboard
        });
      }, clearAfterMs);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setIsCopied(false);
      return false;
    }
  }, [clearAfterMs]);

  return {
    copyToClipboard,
    isCopied,
  };
}