import { useQuery } from '@tanstack/react-query';
import movieService from '@/services/movieService';
import type { Movie, Genre } from '@/types/tmdb';

interface DiscoverParams {
  genre?: string;
  year?: string;
  language?: string;
  rating?: number;
  sortBy?: string;
  page?: number;
}

/**
 * Custom Hook for Discovering Movies with Filters using React Query
 */
export const useDiscoverMovies = (params: DiscoverParams) => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'discover', params],
    queryFn: () => movieService.discoverMovies(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom Hook for Movie Genres List using React Query
 */
export const useMovieGenres = () => {
  return useQuery<Genre[], Error>({
    queryKey: ['genres', 'list'],
    queryFn: () => movieService.getMovieGenres(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useDiscoverMovies;
