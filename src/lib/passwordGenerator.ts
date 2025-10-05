import { PasswordGeneratorOptions } from '@/types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Similar looking characters to exclude

export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';
  
  if (options.includeUppercase) {
    charset += options.excludeSimilar ? UPPERCASE.replace(/[O]/g, '') : UPPERCASE;
  }
  
  if (options.includeLowercase) {
    charset += options.excludeSimilar ? LOWERCASE.replace(/[l]/g, '') : LOWERCASE;
  }
  
  if (options.includeNumbers) {
    charset += options.excludeSimilar ? NUMBERS.replace(/[01]/g, '') : NUMBERS;
  }
  
  if (options.includeSymbols) {
    charset += options.excludeSimilar ? SYMBOLS.replace(/[|]/g, '') : SYMBOLS;
  }
  
  if (!charset) {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}

export function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  let feedback = '';
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) {
    feedback = 'Weak';
  } else if (score <= 4) {
    feedback = 'Medium';
  } else {
    feedback = 'Strong';
  }
  
  return { score, feedback };
}

export const defaultPasswordOptions: PasswordGeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true,
};