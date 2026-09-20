import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User | null;
  error?: string | null;
  session?: unknown;
}

/**
 * Map Supabase user to CineScope User domain model
 */
export function mapSupabaseUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
}): User {
  const email = supabaseUser.email || '';
  const emailUsername = email ? email.split('@')[0] : 'Member';
  const formattedName =
    supabaseUser.user_metadata?.name ||
    supabaseUser.user_metadata?.full_name ||
    emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);

  return {
    id: supabaseUser.id,
    email: email,
    name: formattedName,
    avatarUrl: supabaseUser.user_metadata?.avatar_url,
    createdAt: supabaseUser.created_at,
  };
}

/**
 * CineScope Authentication Service
 * Connected to Supabase Authentication
 */
export const authService = {
  /**
   * Sign In with email and password via Supabase
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const trimmedEmail = credentials.email.trim();
    if (!trimmedEmail || !credentials.password) {
      return {
        user: null,
        session: null,
        error: 'Please provide both email and password.',
      };
    }

    const hasSupabaseUrl = Boolean(import.meta.env.VITE_SUPABASE_URL);
    const hasSupabaseKey = Boolean(import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY);

    if (!hasSupabaseUrl || !hasSupabaseKey) {
      return {
        user: null,
        session: null,
        error: 'Supabase configuration is not detected. Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are in your .env file and restart your Vite server.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: credentials.password,
      });

      if (error) {
        let userFriendlyError = error.message;

        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid_grant') ||
          error.message.toLowerCase().includes('invalid username or password')
        ) {
          userFriendlyError = 'Invalid email or password. Please try again.';
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          userFriendlyError = 'Please confirm your email address before signing in.';
        } else if (error.message.toLowerCase().includes('failed to fetch')) {
          userFriendlyError = 'Unable to connect to authentication server. Please check your internet connection.';
        }

        return {
          user: null,
          session: null,
          error: userFriendlyError,
        };
      }

      // STRICT VALIDATION: Both user and active session must be returned by Supabase
      if (!data?.user || !data?.session) {
        return {
          user: null,
          session: null,
          error: 'Authentication failed: No active session returned by Supabase.',
        };
      }

      const user = mapSupabaseUser(data.user);

      return {
        user,
        session: data.session,
        error: null,
      };
    } catch (err) {
      console.error('Supabase authentication unexpected error:', err);
      return {
        user: null,
        error: 'A connection error occurred. Please try again.',
      };
    }
  },

  /**
   * Sign Out via Supabase
   */
  async signOut(): Promise<{ error?: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err) {
      console.error('Sign out error:', err);
      return { error: 'Failed to sign out.' };
    }
  },

  /**
   * Get Current Active Session User via Supabase
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return mapSupabaseUser(user);
    } catch {
      return null;
    }
  },

  /**
   * Get current Supabase session
   */
  async getSession() {
    return await supabase.auth.getSession();
  },

  /**
   * Subscribe to Supabase auth state change events
   */
  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;

