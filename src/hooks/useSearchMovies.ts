import { useQuery } from '@tanstack/react-query';
import movieService from '@/services/movieService';
import type { Movie } from '@/types/tmdb';

export const useSearchMovies = (query: string) => {
  const cleanQuery = query.trim();

  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'search', cleanQuery],
    queryFn: () => movieService.searchMovies(cleanQuery),
    enabled: cleanQuery.length > 0,
    staleTime: 1000 * 60 * 5, // Cache search results for 5 minutes
  });
};

export default useSearchMovies;
