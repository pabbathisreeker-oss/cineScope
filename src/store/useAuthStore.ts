import { create } from 'zustand';
import type { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  watchlistIds: number[];
  login: (user: User) => void;
  logout: () => Promise<{ success: boolean; error?: string | null }>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  watchlistIds: [],

  login: (user) => set({ user, isAuthenticated: true, error: null }),
  
  setUser: (user) => set({ user, isAuthenticated: Boolean(user), error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error.message);
        return { success: false, error: error.message };
      }
      set({ user: null, isAuthenticated: false, error: null });
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error signing out:', err);
      return { success: false, error: 'Failed to sign out. Please try again.' };
    }
  },
  
  addToWatchlist: (movieId) => 
    set((state) => ({ 
      watchlistIds: state.watchlistIds.includes(movieId) 
        ? state.watchlistIds 
        : [...state.watchlistIds, movieId] 
    })),
    
  removeFromWatchlist: (movieId) => 
    set((state) => ({ 
      watchlistIds: state.watchlistIds.filter((id) => id !== movieId) 
    })),
    
  isInWatchlist: (movieId) => get().watchlistIds.includes(movieId),
}));

export default useAuthStore;

