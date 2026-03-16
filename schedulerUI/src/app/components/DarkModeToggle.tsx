import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * DarkModeToggle Component
 * Simple dark/light mode toggle for individual pages
 * 
 * Usage:
 * <DarkModeToggle />
 * <DarkModeToggle showLabel size="lg" variant="default" />
 */
export function DarkModeToggle({ 
  showLabel = false, 
  size = 'md',
  variant = 'outline'
}: DarkModeToggleProps) {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const labelClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <Button
      onClick={toggleTheme}
      variant={variant}
      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
      className={`gap-2 transition-all ${showLabel ? '' : ''}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun className={`w-5 h-5 text-yellow-500`} />
          {showLabel && <span className={labelClasses[size]}>Light</span>}
        </>
      ) : (
        <>
          <Moon className={`w-5 h-5 text-slate-600`} />
          {showLabel && <span className={labelClasses[size]}>Dark</span>}
        </>
      )}
    </Button>
  );
}
