import movieApi from '@/api/movieApi';
import type { Movie, MovieDetail, PaginatedResponse } from '@/types/tmdb';

/**
 * Re-wired legacy TMDB service that routes through the serverless proxy (/api/movies/*).
 * Prevents any accidental direct requests to TMDB.
 */
export const tmdbService = {
  /**
   * Fetches popular movies via /api/movies/popular
   */
  getPopular: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const results = await movieApi.getPopularMovies(page);
    return {
      page,
      results,
      total_pages: 100,
      total_results: 2000,
    };
  },

  /**
   * Fetches weekly or daily trending movies via /api/movies/trending
   */
  getTrending: async (timeWindow: 'day' | 'week' = 'week', page = 1): Promise<PaginatedResponse<Movie>> => {
    const results = await movieApi.getTrendingMovies(timeWindow);
    return {
      page,
      results,
      total_pages: 100,
      total_results: 2000,
    };
  },

  /**
   * Fetches details of a single movie by ID via /api/movies/:id
   */
  getDetails: async (movieId: number): Promise<MovieDetail> => {
    return (await movieApi.getMovieDetails(movieId)) as MovieDetail;
  },

  /**
   * Searches for movies matching a text query via /api/movies/search
   */
  search: async (query: string, page = 1): Promise<PaginatedResponse<Movie>> => {
    const results = await movieApi.searchMovies(query, page);
    return {
      page,
      results,
      total_pages: 1,
      total_results: results.length,
    };
  },
};

export default tmdbService;
