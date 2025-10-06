'use client';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthInfo {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export default function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const calculateStrength = (pass: string): StrengthInfo => {
    if (!pass) return { score: 0, label: 'Enter password', color: 'text-secondary-400', bgColor: 'bg-secondary-200' };
    
    let score = 0;
    
    // Length
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    
    // Character types
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    
    // Bonus for very long passwords
    if (pass.length >= 16) score++;
    
    if (score <= 2) {
      return { 
        score: Math.max(1, score), 
        label: 'Weak', 
        color: 'text-error-600', 
        bgColor: 'bg-error-500' 
      };
    } else if (score <= 4) {
      return { 
        score, 
        label: 'Fair', 
        color: 'text-warning-600', 
        bgColor: 'bg-warning-500' 
      };
    } else if (score <= 5) {
      return { 
        score, 
        label: 'Good', 
        color: 'text-primary-600', 
        bgColor: 'bg-primary-500' 
      };
    } else {
      return { 
        score, 
        label: 'Strong', 
        color: 'text-success-600', 
        bgColor: 'bg-success-500' 
      };
    }
  };

  const strength = calculateStrength(password);
  const maxScore = 7;

  if (!password) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
          Password strength
        </span>
        <span className={`text-xs font-semibold ${strength.color} dark:opacity-90`}>
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.bgColor} transition-all duration-300 rounded-full`}
          style={{ width: `${(strength.score / maxScore) * 100}%` }}
        />
      </div>
    </div>
  );
}