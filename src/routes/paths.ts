export const PATHS = {
  LANDING: '/',
  SIGN_IN: '/signin',
  HOME: '/home',
  DISCOVER: '/discover',
  AI_PICKS: '/search',
  MOVIE_DETAILS: '/movie/:id',
  SEARCH: '/search',
  WATCHLIST: '/watchlist',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
} as const;

export type AppRoutePaths = typeof PATHS[keyof typeof PATHS];
export default PATHS;

