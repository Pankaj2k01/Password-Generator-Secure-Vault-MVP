'use client';

import { useState } from 'react';
import { generatePassword, getPasswordStrength, defaultPasswordOptions } from '@/lib/passwordGenerator';
import { PasswordGeneratorOptions } from '@/types';
import { useClipboard } from '@/lib/useClipboard';
import { Copy, RefreshCw, Check } from 'lucide-react';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(defaultPasswordOptions);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const { copyToClipboard, isCopied } = useClipboard();

  const handleGeneratePassword = () => {
    try {
      const password = generatePassword(options);
      setGeneratedPassword(password);
      setPasswordStrength(getPasswordStrength(password));
      onPasswordGenerated?.(password);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleOptionChange = (key: keyof PasswordGeneratorOptions, value: boolean | number) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
  };

  const handleCopy = async () => {
    if (generatedPassword) {
      await copyToClipboard(generatedPassword);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Password Generator
      </h2>

      {/* Length Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {options.length}
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={options.length}
          onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Character Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Uppercase letters (A-Z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Lowercase letters (a-z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$%...)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Exclude similar characters (0, O, 1, l, I, |)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGeneratePassword}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <RefreshCw size={18} />
        <span>Generate Password</span>
      </button>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mt-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Password Strength */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Strength:</span>
            <span className={`text-sm font-medium ${
              passwordStrength.score <= 2 ? 'text-red-500' :
              passwordStrength.score <= 4 ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {passwordStrength.feedback}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}