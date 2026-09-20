import { createContext } from 'react';
import type { User } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<{ success: boolean; error?: string | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
