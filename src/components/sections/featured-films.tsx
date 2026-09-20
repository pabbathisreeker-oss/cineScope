import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  fetchTrendingMovies,
  toCoverflowSlide,
  FALLBACK_FILMS,
  type TMDBMovie,
} from '@/lib/tmdb';
import CoverflowCarousel, {
  type CoverflowSlide,
} from '@/components/ui/coverflow-carousel';

export interface FeaturedFilmsProps {
  children?: React.ReactNode;
}

export const FeaturedFilms: React.FC<FeaturedFilmsProps> = ({ children }) => {
  const [slides, setSlides] = useState<CoverflowSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFilms() {
      try {
        const rawMovies: TMDBMovie[] = await fetchTrendingMovies(12);

        if (isMounted) {
          if (rawMovies && rawMovies.length > 0) {
            const mappedSlides = rawMovies.map((movie, index) =>
              toCoverflowSlide(movie, index)
            );
            setSlides(mappedSlides);
          } else {
            setSlides(FALLBACK_FILMS);
          }
        }
      } catch (err) {
        console.warn(
          'Failed to load live trending films for coverflow, using fallback collection:',
          err
        );
        if (isMounted) {
          setSlides(FALLBACK_FILMS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFilms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-[#0a0e1a] py-20 md:py-24 overflow-hidden select-none"
    >
      {/* Background ambient gold/indigo cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#e8a355]/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[250px] bg-indigo-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-6 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#e8a355] shadow-[0_0_8px_rgba(232,163,85,0.7)]" />
          <p className="font-body text-xs uppercase font-bold tracking-[0.25em] text-[#e8a355]">
            • FEATURED COLLECTION
          </p>
        </div>

        {/* Two-Tone Headline */}
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase tracking-wide text-white leading-[0.95] drop-shadow-2xl">
          Stories{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a355] via-[#f8dfad] to-[#e8a355]">
            Worth Revisiting
          </span>
        </h2>

        {/* One-Line Subheading */}
        <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed font-body text-balance">
          Explore iconic masterpieces and modern triumphs in an interactive, fluid coverflow showcase.
        </p>

        {/* Carousel or Shimmer Skeleton */}
        <div className="w-full mt-8 sm:mt-10">
          {isLoading ? (
            <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] flex items-center justify-center space-x-3 sm:space-x-4 px-4 overflow-hidden">
              {/* Left outer skeleton */}
              <div className="hidden lg:block w-[200px] aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 opacity-30 animate-pulse" />
              {/* Left inner skeleton */}
              <div className="hidden sm:block w-[240px] aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 opacity-50 animate-pulse" />
              {/* Center active card skeleton */}
              <div className="w-[260px] sm:w-[300px] md:w-[340px] aspect-[2/3] rounded-2xl bg-white/5 border border-[#e8a355]/30 animate-pulse shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              </div>
              {/* Right inner skeleton */}
              <div className="hidden sm:block w-[240px] aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 opacity-50 animate-pulse" />
              {/* Right outer skeleton */}
              <div className="hidden lg:block w-[200px] aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 opacity-30 animate-pulse" />
            </div>
          ) : (
            <CoverflowCarousel
              slides={slides}
              cardWidth="clamp(200px, 25vw, 360px)"
              rotate={42}
              depth={0.55}
              perspective={3.2}
              falloff={0.55}
              fade={0.12}
              gap={0.06}
              showCaption
              showPagination
              showNavigation
            />
          )}
        </div>

        {/* Optional Children slot (e.g. Action Buttons) */}
        {children}
      </div>
    </motion.section>
  );
};

export default FeaturedFilms;
