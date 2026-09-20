import React, { useEffect } from 'react';
import useThemeStore, { type Theme } from '@/store/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Resolve "system" theme to actual "light" or "dark"
    const resolveTheme = (targetTheme: Theme): 'light' | 'dark' => {
      if (targetTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
      }
      return targetTheme;
    };

    const activeTheme = resolveTheme(theme);
    
    // Remove both classes to reset
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    
    // Set color scheme attribute for modern CSS styling and browser UI adaptations
    root.style.colorScheme = activeTheme;

    // Handle system preference changes if theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemTheme);
        root.style.colorScheme = newSystemTheme;
      };

      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
