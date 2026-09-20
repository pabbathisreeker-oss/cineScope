import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { Play, Bookmark, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { RatingBadge, RuntimeBadge, GenreChip } from './Badges';
import { Spinner } from './Feedback';
import type { HeroMovieData } from '@/features/movies/data/mockMovies';
import useWatchlistStore from '@/features/watchlist/store/useWatchlistStore';

interface HeroProps {
  movie?: HeroMovieData | null;
  isLoading?: boolean;
  onPlayTrailer?: (movie: HeroMovieData) => void;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  movie,
  isLoading = false,
  onPlayTrailer,
  className,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { items, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  // Reset image loaded state when movie backdrop changes
  useEffect(() => {
    setImageLoaded(false);
  }, [movie?.backdropPath]);

  // Check if current hero movie is in watchlist
  const isBookmarked = movie ? items.some((item) => String(item.movie.id) === String(movie.id)) : false;

  const handleWatchlistToggle = () => {
    if (!movie) return;
    if (isBookmarked) {
      removeFromWatchlist(Number(movie.id));
    } else {
      addToWatchlist({
        id: Number(movie.id),
        title: movie.title,
        original_title: movie.title,
        overview: movie.overview,
        poster_path: movie.posterPath,
        backdrop_path: movie.backdropPath,
        release_date: String(movie.releaseYear),
        vote_average: movie.voteAverage,
        vote_count: 1000,
        popularity: 100,
        genre_ids: [],
        adult: false,
        video: false,
        original_language: 'en',
      });
    }
  };

  // Mouse Parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const parallaxX = useSpring(rawX, { stiffness: 100, damping: 20 });
  const parallaxY = useSpring(rawY, { stiffness: 100, damping: 20 });
  const bgX = useTransform(parallaxX, [-0.5, 0.5], [-15, 15]);
  const bgY = useTransform(parallaxY, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) - 0.5);
      rawY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // -------------------------------------------------------------
  // Loading Skeleton View
  // -------------------------------------------------------------
  if (isLoading || !movie) {
    return (
      <section
        className={cn(
          "relative w-full min-h-[100svh] flex items-end overflow-hidden bg-background select-none",
          className
        )}
      >
        <div className="absolute inset-0 bg-zinc-900/40 animate-pulse z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 pt-32 flex flex-col lg:flex-row items-end justify-between gap-10 lg:gap-16">
          <div className="flex-1 max-w-2xl space-y-4 w-full">
            <div className="h-4 bg-surface rounded w-1/4 animate-pulse" />
            <div className="h-12 md:h-16 bg-surface rounded w-3/4 animate-pulse" />
            <div className="flex space-x-3 py-2">
              <div className="h-6 w-16 bg-surface rounded animate-pulse" />
              <div className="h-6 w-16 bg-surface rounded animate-pulse" />
              <div className="h-6 w-24 bg-surface rounded animate-pulse" />
            </div>
            <div className="h-16 bg-surface/70 rounded w-full animate-pulse" />
            <div className="flex space-x-4 pt-4">
              <div className="h-12 w-36 bg-surface rounded-full animate-pulse" />
              <div className="h-12 w-36 bg-surface rounded-full animate-pulse" />
            </div>
          </div>

          <div className="hidden lg:block w-64 xl:w-72 aspect-[2/3] rounded-2xl bg-surface animate-pulse flex-shrink-0" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative w-full min-h-[100svh] flex items-end overflow-hidden bg-background select-none",
        className
      )}
    >
      {/* 1. Dynamic Parallax Backdrop + Ken Burns Animation */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-20px] z-0">
        <motion.img
          key={movie.backdropPath}
          src={movie.backdropPath}
          alt={movie.title}
          role="presentation"
          onLoad={() => setImageLoaded(true)}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-[1.5s]",
            imageLoaded ? "opacity-70" : "opacity-0"
          )}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Spinner size="lg" />
          </div>
        )}
      </motion.div>

      {/* 2. Cinematic Gradient Overlays & Ambient Lighting */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-44 z-10 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none cinematic-vignette" />
      
      {/* Soft atmospheric colored glows */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[140px] pointer-events-none z-10" />
      <div className="absolute top-1/4 right-16 w-[450px] h-[450px] rounded-full bg-accent/[0.05] blur-[130px] pointer-events-none z-10" />

      {/* 3. Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 pt-32 flex flex-col lg:flex-row items-end lg:items-end justify-between gap-10 lg:gap-16">

        {/* Left: Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-2xl"
        >
          {movie.tagline && (
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 backdrop-blur-md mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(124,111,240,0.8)]" />
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-accent uppercase font-body">
                {movie.tagline}
              </p>
            </motion.div>
          )}

          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 tracking-tight leading-[1.03] drop-shadow-xl"
          >
            {movie.title}
          </motion.h1>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 mb-5">
            <RatingBadge rating={movie.voteAverage} size="md" />
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/[0.08] bg-surface/60 text-muted-foreground shadow-sm">
              {movie.releaseYear}
            </span>
            {movie.runtime && movie.runtime > 0 && <RuntimeBadge minutes={movie.runtime} />}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              {movie.genres?.map((g) => (
                <GenreChip key={g} name={g} />
              ))}
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-8 max-w-xl"
          >
            {movie.overview}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Play className="h-5 w-5 fill-current" />}
              onClick={() => {
                if (onPlayTrailer) {
                  onPlayTrailer(movie);
                } else {
                  navigate(`/movie/${movie.id}`);
                }
              }}
            >
              Watch Trailer
            </Button>

            <Button
              variant="secondary"
              size="lg"
              leftIcon={
                <Bookmark
                  className={cn("h-5 w-5 transition-colors", isBookmarked ? "fill-accent text-accent" : "text-muted-foreground")}
                />
              }
              onClick={handleWatchlistToggle}
            >
              {isBookmarked ? 'Saved in Watchlist' : 'Watchlist'}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              leftIcon={<Info className="h-5 w-5" />}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="text-foreground/80 hover:text-foreground border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              Details
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Floating Dynamic Poster (Desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="hidden lg:block flex-shrink-0"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.03, y: -14 }}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="w-64 xl:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 hover:from-primary/70 hover:via-accent/40 hover:to-primary/70 transition-all duration-500 group cursor-pointer relative"
          >
            <div className="w-full h-full rounded-[15px] overflow-hidden relative">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1 drop-shadow-md">
                  <span>View Details</span>
                  <span className="text-primary font-bold">→</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.5 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll to explore"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.button>
    </section>
  );
};

export default Hero;
