import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mapSupabaseUser } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    // 1. Initial session check on application startup
    async function initSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (sessionError) {
          console.warn('Initial session check error:', sessionError.message);
          setUser(null);
        } else if (data?.session?.user) {
          setUser(mapSupabaseUser(data.session.user));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('Unexpected error during session initialization:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initSession();

    // 2. Real-time Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
