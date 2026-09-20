// Centralized CineScope Backend API Endpoint Paths (/api proxy)
export const TMDB_ENDPOINTS = {
  TRENDING_MOVIES: '/movies/trending',
  POPULAR_MOVIES: '/movies/popular',
  TOP_RATED_MOVIES: '/movies/top-rated',
  NOW_PLAYING_MOVIES: '/movies/now-playing',
  UPCOMING_MOVIES: '/movies/upcoming',
  MOVIE_DETAILS: (id: string | number) => `/movies/${id}`,
  DISCOVER_MOVIES: '/movies/discover',
  SEARCH_MOVIES: '/movies/search',
  GENRES_LIST: '/movies/genres',
} as const;

export default TMDB_ENDPOINTS;
