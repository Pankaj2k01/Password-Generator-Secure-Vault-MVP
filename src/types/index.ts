export interface User {
  _id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VaultItem {
  _id?: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  tags?: string[];
  folder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EncryptedVaultItem {
  _id?: string;
  userId: string;
  encryptedData: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
}