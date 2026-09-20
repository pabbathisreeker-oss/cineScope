import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Film, Sparkles } from 'lucide-react';
import type { Movie } from '@/types/tmdb';
import { RatingBadge } from '@/components/ui/Badges';
import { Skeleton } from '@/components/ui/Feedback';

interface SimilarMoviesSectionProps {
  movies?: Movie[];
  isLoading?: boolean;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ============================================================================
// 1. SIMILAR MOVIE CARD
// ============================================================================
export const SimilarMovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const navigate = useNavigate();

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const posterUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="flex-shrink-0 w-36 sm:w-44 lg:w-48 rounded-2xl overflow-hidden bg-surface/60 border border-border p-2.5 flex flex-col group hover:border-primary/50 hover:shadow-card-hover transition-all duration-300 backdrop-blur-md cursor-pointer select-none"
    >
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-background mb-2.5">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 z-10">
          <RatingBadge rating={movie.vote_average} size="sm" />
        </div>
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {movie.title}
      </h4>
      <span className="text-[11px] font-semibold text-muted-foreground mt-0.5">
        {releaseYear}
      </span>
    </motion.div>
  );
};

// ============================================================================
// 2. SIMILAR MOVIE SKELETON
// ============================================================================
export const SimilarMovieSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 lg:w-48 rounded-2xl bg-surface/60 border border-border p-2.5 flex flex-col space-y-2.5">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/3 rounded" />
    </div>
  );
};

// ============================================================================
// 3. SIMILAR MOVIES SECTION WRAPPER
// ============================================================================
export const SimilarMoviesSection: React.FC<SimilarMoviesSectionProps> = ({
  movies = [],
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4 my-6">
        <h2 className="text-lg font-bold font-display text-foreground">You May Also Like</h2>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <SimilarMovieSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  const similarList = movies.slice(0, 10);

  if (similarList.length === 0) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-border text-center flex flex-col items-center justify-center my-6">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
          <Film className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-0.5">No Similar Movies Found</h3>
        <p className="text-xs text-muted-foreground">
          We couldn't find matching recommendations for this title.
        </p>
      </div>
    );
  }

  return (
    <motion.section
      variants={fadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 my-6 select-none"
    >
      {/* Header with Carousel Scroll Arrows */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
            You May Also Like
          </h2>
          <span className="text-xs text-muted-foreground">({similarList.length})</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-surface/80 hover:bg-primary hover:text-primary-foreground border border-border text-foreground transition-colors cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-surface/80 hover:bg-primary hover:text-primary-foreground border border-border text-foreground transition-colors cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x"
      >
        {similarList.map((m) => (
          <div key={m.id} className="snap-start">
            <SimilarMovieCard movie={m} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default SimilarMoviesSection;

