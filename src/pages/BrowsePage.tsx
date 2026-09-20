import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/ui/Hero';
import Carousel from '@/components/ui/Carousel';
import MovieCard from '@/features/movies/components/MovieCard';
import useTrendingMovies from '@/hooks/useTrendingMovies';
import useMovieDetails from '@/hooks/useMovieDetails';
import movieService from '@/services/movieService';
import type { Movie } from '@/types/tmdb';
import type { HeroMovieData } from '@/features/movies/data/mockMovies';

const MovieCarousel: React.FC<{
  title: string;
  subtitle: string;
  movies: Movie[];
  isLoading?: boolean;
}> = ({ title, subtitle, movies, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 my-6 select-none">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-zinc-800/80 rounded animate-pulse" />
          <div className="h-4 w-64 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-800/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Carousel title={title} subtitle={subtitle} showViewAll>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Carousel>
  );
};

export const BrowsePage: React.FC = () => {
  // 1. Fetch Trending Movies (TMDB API / Service)
  const { data: trendingMovies = [], isLoading: isTrendingLoading } = useTrendingMovies('day');

  // 2. Fetch Popular Movies
  const { data: popularMovies = [], isLoading: isPopularLoading } = useQuery<Movie[]>({
    queryKey: ['movies', 'popular'],
    queryFn: () => movieService.getPopularMovies(),
  });

  // 3. Fetch Top Rated Movies
  const { data: topRatedMovies = [], isLoading: isTopRatedLoading } = useQuery<Movie[]>({
    queryKey: ['movies', 'topRated'],
    queryFn: () => movieService.getTopRatedMovies(),
  });

  // 4. Fetch Recently Released Movies
  const { data: recentMovies = [], isLoading: isRecentLoading } = useQuery<Movie[]>({
    queryKey: ['movies', 'recent'],
    queryFn: () => movieService.getNowPlayingMovies(),
  });

  // Select the top featured movie from live trending results
  const featuredMovieId = trendingMovies[0]?.id;

  // Fetch full details (tagline, runtime, genres, backdrop) for the featured hero movie
  const { data: featuredDetail, isLoading: isHeroLoading } = useMovieDetails(featuredMovieId);

  // Transform featured movie details into dynamic HeroMovieData format
  const heroMovieData: HeroMovieData | null = useMemo(() => {
    if (featuredDetail) {
      return {
        id: featuredDetail.id,
        title: featuredDetail.title,
        tagline: featuredDetail.tagline || `A cinematic journey in ${featuredDetail.genres[0]?.name || 'cinema'}.`,
        overview: featuredDetail.overview,
        backdropPath: featuredDetail.backdropPath,
        posterPath: featuredDetail.posterPath,
        voteAverage: featuredDetail.voteAverage,
        releaseYear: featuredDetail.releaseYear,
        runtime: featuredDetail.runtime,
        genres: featuredDetail.genres.map((g) => (typeof g === 'string' ? g : g.name)),
      };
    }

    // Fallback if detail is still loading or using raw trending item
    const firstMovie = trendingMovies[0];
    if (firstMovie) {
      const posterPath = firstMovie.poster_path
        ? (firstMovie.poster_path.startsWith('http') ? firstMovie.poster_path : `https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`)
        : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

      const backdropPath = firstMovie.backdrop_path
        ? (firstMovie.backdrop_path.startsWith('http') ? firstMovie.backdrop_path : `https://image.tmdb.org/t/p/original${firstMovie.backdrop_path}`)
        : posterPath;

      const releaseYear = firstMovie.release_date
        ? new Date(firstMovie.release_date).getFullYear()
        : 2024;

      return {
        id: firstMovie.id,
        title: firstMovie.title,
        tagline: 'Trending Featured Movie',
        overview: firstMovie.overview,
        backdropPath,
        posterPath,
        voteAverage: firstMovie.vote_average,
        releaseYear,
        runtime: 135,
        genres: ['Cinema', 'Popular'],
      };
    }

    return null;
  }, [featuredDetail, trendingMovies]);

  return (
    <div className="flex flex-col">
      {/* Full-Bleed Live Data Hero Section */}
      <Hero
        movie={heroMovieData}
        isLoading={isHeroLoading || (isTrendingLoading && !heroMovieData)}
      />

      {/* Carousel Sections */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16 py-12 sm:py-16">

        <MovieCarousel
          title="🔥 Trending Now"
          subtitle="What everyone's watching right now"
          movies={trendingMovies}
          isLoading={isTrendingLoading}
        />

        <MovieCarousel
          title="⭐ Popular"
          subtitle="All-time fan favorites across genres"
          movies={popularMovies}
          isLoading={isPopularLoading}
        />

        <MovieCarousel
          title="🏆 Top Rated"
          subtitle="Highest rated movies of all time"
          movies={topRatedMovies}
          isLoading={isTopRatedLoading}
        />

        <MovieCarousel
          title="🎬 Recently Released"
          subtitle="Fresh arrivals you don't want to miss"
          movies={recentMovies}
          isLoading={isRecentLoading}
        />

      </div>
    </div>
  );
};

export default BrowsePage;
