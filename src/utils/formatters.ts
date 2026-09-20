/**
 * Utility functions for formatting data in CineScope
 */

import { TMDB_IMAGE_BASE_URL, DEFAULT_PLACEHOLDERS } from '@/constants';

/**
 * Format currency values to USD string (e.g. $100,000,000)
 */
export const formatCurrency = (amount?: number): string => {
  if (!amount || amount <= 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format runtime minutes into hours & minutes (e.g. 2h 15m)
 */
export const formatRuntime = (minutes?: number): string => {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format date string (e.g. 2024-03-01 -> Mar 1, 2024 or 2024)
 */
export const formatDate = (dateStr?: string, yearOnly: boolean = false): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  if (yearOnly) return String(date.getFullYear());
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Construct TMDB Image URL with automatic type resolution and fallback
 */
export const buildImageUrl = (
  path: string | null | undefined,
  type: 'poster' | 'backdrop' | 'profile' | 'logo' = 'poster',
  size: 'small' | 'medium' | 'original' = 'medium'
): string => {
  if (!path) {
    if (type === 'backdrop') return DEFAULT_PLACEHOLDERS.BACKDROP;
    if (type === 'profile') return DEFAULT_PLACEHOLDERS.AVATAR;
    return DEFAULT_PLACEHOLDERS.POSTER;
  }

  if (path.startsWith('http')) return path;

  switch (type) {
    case 'backdrop':
      return size === 'original'
        ? `${TMDB_IMAGE_BASE_URL.BACKDROP_ORIGINAL}${path}`
        : `${TMDB_IMAGE_BASE_URL.BACKDROP_MEDIUM}${path}`;
    case 'profile':
      return `${TMDB_IMAGE_BASE_URL.PROFILE}${path}`;
    case 'logo':
      return `${TMDB_IMAGE_BASE_URL.LOGO}${path}`;
    case 'poster':
    default:
      return size === 'small'
        ? `${TMDB_IMAGE_BASE_URL.POSTER_SMALL}${path}`
        : `${TMDB_IMAGE_BASE_URL.POSTER_MEDIUM}${path}`;
  }
};

/**
 * Get CSS color representation based on rating (0 - 10)
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  if (rating >= 6.5) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
};
