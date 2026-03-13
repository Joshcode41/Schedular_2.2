import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'purple' | 'green' | 'rose' | 'amber' | 'slate';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_THEMES: Record<ColorTheme, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 text-blue-50',
  purple: 'bg-purple-600 hover:bg-purple-700 text-purple-50',
  green: 'bg-green-600 hover:bg-green-700 text-green-50',
  rose: 'bg-rose-600 hover:bg-rose-700 text-rose-50',
  amber: 'bg-amber-600 hover:bg-amber-700 text-amber-50',
  slate: 'bg-slate-600 hover:bg-slate-700 text-slate-50',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || 'system';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('colorTheme') as ColorTheme | null;
    return stored || 'blue';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Determine if we should use dark mode
    const shouldBeDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    localStorage.setItem('colorTheme', newColorTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function getColorThemeClass(colorTheme: ColorTheme, type: 'button' | 'text' | 'bg' = 'button') {
  if (type === 'button') {
    return COLOR_THEMES[colorTheme];
  }
  // Add more class mappings as needed
  return COLOR_THEMES[colorTheme];
}
