// Centralized constants for CineScope application

export const TMDB_IMAGE_BASE_URL = {
  POSTER_SMALL: 'https://image.tmdb.org/t/p/w185',
  POSTER_MEDIUM: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_MEDIUM: 'https://image.tmdb.org/t/p/w780',
  BACKDROP_ORIGINAL: 'https://image.tmdb.org/t/p/original',
  LOGO: 'https://image.tmdb.org/t/p/w92',
  PROFILE: 'https://image.tmdb.org/t/p/w185',
} as const;

export const DEFAULT_PLACEHOLDERS = {
  POSTER: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop',
  BACKDROP: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
  AVATAR: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
} as const;

export const PAGE_SIZES = {
  DEFAULT: 20,
  SIMILAR_MOVIES: 10,
  RECOMMENDATIONS: 6,
  CAST_PREVIEW: 12,
  GALLERY_PREVIEW: 6,
} as const;

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.35,
  SLOW: 0.5,
} as const;
