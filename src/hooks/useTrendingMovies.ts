import { useQuery } from '@tanstack/react-query';
import movieService from '@/services/movieService';
import type { Movie } from '@/types/tmdb';

export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'day') => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'trending', timeWindow],
    queryFn: () => movieService.getTrendingMovies(timeWindow),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};

export default useTrendingMovies;
