import CryptoJS from 'crypto-js';

// Generate a random encryption key for each user session
// In production, this should be derived from user's master password
let encryptionKey: string | null = null;

export function setEncryptionKey(key: string) {
  encryptionKey = key;
}

export function generateEncryptionKey(masterPassword: string, salt: string): string {
  // Use PBKDF2 to derive a key from master password
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000
  });
  return key.toString();
}

export function encryptData(data: unknown): string {
  if (!encryptionKey) {
    throw new Error('Encryption key not set');
  }
  
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
  return encrypted;
}

export function decryptData(encryptedData: string): unknown {
  if (!encryptionKey) {
    throw new Error('Encryption key not set');
  }
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

export function hashPassword(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
}