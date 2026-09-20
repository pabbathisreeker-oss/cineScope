import tmdbClient from './tmdb';
import TMDB_ENDPOINTS from './endpoints';
import type { Movie, PaginatedResponse, Genre } from '@/types/tmdb';

/**
 * Dedicated API Layer for CineScope Serverless Proxy Requests
 */
export const movieApi = {
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'day'): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.TRENDING_MOVIES, {
      params: { timeWindow },
    });
    return data.results || [];
  },

  getPopularMovies: async (page: number = 1): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.POPULAR_MOVIES, {
      params: { page },
    });
    return data.results || [];
  },

  getTopRatedMovies: async (page: number = 1): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.TOP_RATED_MOVIES, {
      params: { page },
    });
    return data.results || [];
  },

  getNowPlayingMovies: async (page: number = 1): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.NOW_PLAYING_MOVIES, {
      params: { page },
    });
    return data.results || [];
  },

  getUpcomingMovies: async (page: number = 1): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.UPCOMING_MOVIES, {
      params: { page },
    });
    return data.results || [];
  },

  getMovieDetails: async (id: string | number) => {
    const { data } = await tmdbClient.get(TMDB_ENDPOINTS.MOVIE_DETAILS(id));
    return data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.SEARCH_MOVIES, {
      params: { q: query, page },
    });
    return data.results || [];
  },

  discoverMovies: async (params: Record<string, any>): Promise<Movie[]> => {
    const { data } = await tmdbClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.DISCOVER_MOVIES, {
      params,
    });
    return data.results || [];
  },

  getGenres: async (): Promise<Genre[]> => {
    const { data } = await tmdbClient.get<{ genres: Genre[] }>(TMDB_ENDPOINTS.GENRES_LIST);
    return data.genres || [];
  },
};

export default movieApi;
