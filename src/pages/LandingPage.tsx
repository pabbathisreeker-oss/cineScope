import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ImageStreamHero, { type StreamImage } from '@/components/ui/image-stream-hero';
import FeaturedFilms from '@/components/sections/featured-films';
import { CineScopeLogo } from '@/components/ui/CineScopeLogo';
import useTrendingMovies from '@/hooks/useTrendingMovies';
import PATHS from '@/routes/paths';
import { FALLBACK_FILMS } from '@/lib/tmdb';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: trendingMovies = [] } = useTrendingMovies('day');

  // Map real TMDB movie posters from the live catalog (with fallback)
  const heroImages: StreamImage[] = React.useMemo(() => {
    if (!trendingMovies || trendingMovies.length === 0) {
      return FALLBACK_FILMS.map((film) => ({
        src: film.src,
        alt: film.alt,
      }));
    }

    return trendingMovies.slice(0, 16).map((movie) => {
      const posterUrl = movie.poster_path
        ? (movie.poster_path.startsWith('http')
          ? movie.poster_path
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

      return {
        src: posterUrl,
        alt: `${movie.title} poster`,
      };
    });
  }, [trendingMovies]);

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden select-none">
      <ImageStreamHero
        images={heroImages}
        className="h-screen w-full bg-background"
        cards={10}
        speed={22}
      >
        {/* Cinematic gradient overlays for contrast & legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70 pointer-events-none z-0" />

        {/* Brand moment and interactive hero call-to-action */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 md:py-16 text-center px-4">
          
          {/* Top Wordmark & Brand Badge */}
          <div className="pt-2">
            <CineScopeLogo size="lg" layout="vertical" variant="full" />
          </div>

          {/* Centered Hero Content */}
          <div className="max-w-3xl px-4 flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-6 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="font-body text-xs uppercase font-bold tracking-[0.25em] text-accent">
                Welcome to CineScope
              </p>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase tracking-wide text-foreground leading-[0.95] drop-shadow-2xl">
              Every Story <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#f8dfad] to-primary">
                Worth Watching
              </span>
            </h1>

            <p className="mt-6 max-w-xl font-body text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Every story worth watching, in one place. Discover, track, and revisit the films you love with premier cinematic curation.
            </p>
          </div>

          {/* Bottom Catalog Features Bar */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground pb-2">
            <span className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Real-Time TMDB Catalog</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Personalized Watchlist</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Midnight Marquee Experience</span>
            </span>
          </div>

        </div>
      </ImageStreamHero>

      <FeaturedFilms>
        {/* Action Buttons repositioned below the Featured Films coverflow section */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 z-20">
          <button
            onClick={() => navigate(PATHS.SIGN_IN)}
            className="group relative inline-flex items-center space-x-3 rounded-full bg-primary px-8 py-3.5 font-body font-bold text-sm text-primary-foreground transition-all duration-300 hover:bg-primary-hover hover:scale-105 hover:shadow-[0_0_30px_rgba(212,161,90,0.5)] cursor-pointer"
          >
            <span>Enter CineScope</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate(PATHS.DISCOVER)}
            className="inline-flex items-center space-x-2 rounded-full border border-border bg-surface/70 px-6 py-3.5 font-body font-semibold text-sm text-foreground backdrop-blur-md transition-all duration-300 hover:bg-surface-hover hover:border-accent/50 hover:text-accent cursor-pointer"
          >
            <span>Explore Catalog</span>
          </button>
        </div>
      </FeaturedFilms>
    </div>
  );
};

export default LandingPage;
