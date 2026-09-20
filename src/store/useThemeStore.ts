import { create } from 'zustand';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark', // Cinematic first - default to dark theme
  setTheme: (theme) => set({ theme }),
}));
export default useThemeStore;
