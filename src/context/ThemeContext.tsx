import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rcat-theme') as ThemeMode;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.add('theme-light', 'light');
      root.classList.remove('theme-dark', 'dark');
    } else {
      root.classList.add('theme-dark', 'dark');
      root.classList.remove('theme-light', 'light');
    }
    localStorage.setItem('rcat-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;
    setIsTransitioning(true);
    setThemeState(newTheme);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
