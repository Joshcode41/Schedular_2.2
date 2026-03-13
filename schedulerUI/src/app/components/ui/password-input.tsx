import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';

interface PasswordInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (valueOrEvent: string | React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({
    id,
    label,
    placeholder = 'Enter password',
    value,
    onChange,
    error,
    className = '',
    disabled = false,
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        // Support both react-hook-form and regular onChange handlers
        onChange(e);
      }
    };

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`pr-10 ${error ? 'border-red-500' : ''} ${className}`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
