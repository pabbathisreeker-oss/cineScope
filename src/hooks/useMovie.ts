import { useQuery } from '@tanstack/react-query';
import movieService from '@/services/movieService';
import type { DetailedMovieData, CastMember, CrewMember, MovieVideo, MovieReview, WatchProvidersData } from '@/features/movies/data/mockMovieDetails';
import type { Movie } from '@/types/tmdb';

/**
 * Custom Hook for fetching complete Movie Details
 */
export const useMovie = (id: string | number | undefined) => {
  return useQuery<DetailedMovieData | null, Error>({
    queryKey: ['movie', 'detail', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return movieService.getMovieDetails(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 15,
  });
};

/**
 * Custom Hook for fetching Movie Credits (Cast & Crew)
 */
export const useMovieCredits = (id: string | number | undefined) => {
  const { data: movie, isLoading, isError, error } = useMovie(id);
  return {
    cast: (movie?.cast || []) as CastMember[],
    crew: (movie?.crew || []) as CrewMember[],
    director: movie?.director as CrewMember | undefined,
    writers: (movie?.writers || []) as CrewMember[],
    isLoading,
    isError,
    error,
  };
};

/**
 * Custom Hook for fetching Movie Videos / Trailers
 */
export const useMovieVideos = (id: string | number | undefined) => {
  const { data: movie, isLoading, isError, error } = useMovie(id);
  return {
    videos: (movie?.videos || []) as MovieVideo[],
    trailerYoutubeId: movie?.trailerYoutubeId,
    isLoading,
    isError,
    error,
  };
};

/**
 * Custom Hook for fetching Movie Reviews
 */
export const useMovieReviews = (id: string | number | undefined) => {
  const { data: movie, isLoading, isError, error } = useMovie(id);
  return {
    reviews: (movie?.reviews || []) as MovieReview[],
    isLoading,
    isError,
    error,
  };
};

/**
 * Custom Hook for fetching Similar Movies & Recommendations
 */
export const useSimilarMovies = (id: string | number | undefined) => {
  const { data: movie, isLoading, isError, error } = useMovie(id);
  return {
    similarMovies: (movie?.similarMovies || []) as Movie[],
    recommendations: (movie?.recommendations || []) as Movie[],
    isLoading,
    isError,
    error,
  };
};

/**
 * Custom Hook for fetching Watch Providers
 */
export const useWatchProviders = (id: string | number | undefined) => {
  const { data: movie, isLoading, isError, error } = useMovie(id);
  return {
    watchProviders: (movie?.watchProviders || null) as WatchProvidersData | null,
    isLoading,
    isError,
    error,
  };
};

export default useMovie;
