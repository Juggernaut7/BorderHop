import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('borderhop-theme') as Theme;
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('borderhop-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update CSS custom properties for smooth transitions
    if (theme === 'dark') {
      root.style.setProperty('--color-primary', '59 130 246');
      root.style.setProperty('--color-secondary', '139 92 246');
      root.style.setProperty('--color-accent', '6 182 212');
      root.style.setProperty('--color-background', '15 23 42');
      root.style.setProperty('--color-surface', '30 41 59');
      root.style.setProperty('--color-text', '248 250 252');
      root.style.setProperty('--color-text-secondary', '203 213 225');
      root.style.setProperty('--color-border', '51 65 85');
      root.style.setProperty('--color-success', '34 197 94');
      root.style.setProperty('--color-warning', '245 158 11');
      root.style.setProperty('--color-error', '239 68 68');
    } else {
      root.style.setProperty('--color-primary', '37 99 235');
      root.style.setProperty('--color-secondary', '124 58 237');
      root.style.setProperty('--color-accent', '8 145 178');
      root.style.setProperty('--color-background', '255 255 255');
      root.style.setProperty('--color-surface', '248 250 252');
      root.style.setProperty('--color-text', '15 23 42');
      root.style.setProperty('--color-text-secondary', '71 85 105');
      root.style.setProperty('--color-border', '226 232 240');
      root.style.setProperty('--color-success', '34 197 94');
      root.style.setProperty('--color-warning', '245 158 11');
      root.style.setProperty('--color-error', '239 68 68');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 