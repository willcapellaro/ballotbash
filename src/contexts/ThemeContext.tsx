import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Theme, type ThemeMode } from '../types';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

const defaultTheme: Theme = {
  mode: 'system',
  highContrast: false,
  showGameControls: false,
  showScoreBar: false,
  showUuids: false
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (!saved) return defaultTheme;
    try {
      const parsedTheme = JSON.parse(saved);
      // Ensure all default properties exist
      return {
        ...defaultTheme,
        ...parsedTheme
      };
    } catch (error) {
      console.error('Error parsing theme:', error);
      return defaultTheme;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Apply theme classes
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme.mode === 'dark' || (theme.mode === 'system' && prefersDark);
    
    root.classList.toggle('dark', isDark);
    root.classList.toggle('high-contrast', theme.highContrast);
    
    if (theme.highContrast) {
      root.style.setProperty('--font-weight-normal', '500');
      root.style.setProperty('--icon-opacity', '1');
    } else {
      root.style.setProperty('--font-weight-normal', '400');
      root.style.setProperty('--icon-opacity', '0.5');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}