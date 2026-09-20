import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function normalizeSupabaseConfig() {
  const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
  const rawKey = (import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');

  let url = rawUrl;
  if (url) {
    // If user provided just project ref like "ydvianukbkgsurjfrrap", turn into full Supabase URL
    if (!url.includes('.') && !url.includes('/')) {
      url = `https://${url}.supabase.co`;
    } else if (!url.match(/^https?:\/\//i)) {
      url = `https://${url}`;
    }
  }

  const validUrl = url && url.match(/^https?:\/\//i) ? url : 'https://placeholder-project.supabase.co';
  const validKey = rawKey || 'placeholder-anon-key';

  return { url: validUrl, key: validKey, isConfigured: Boolean(rawUrl && rawKey) };
}

const { url, key, isConfigured } = normalizeSupabaseConfig();

if (!isConfigured) {
  console.warn(
    'CineScope Warning: Supabase credentials are missing or placeholder. Check VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env'
  );
}

let clientInstance: SupabaseClient;
try {
  clientInstance = createClient(url, key);
} catch (error) {
  console.warn('CineScope: Failed to initialize Supabase client, using fallback:', error);
  clientInstance = createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');
}

export const supabase = clientInstance;
export default supabase;
