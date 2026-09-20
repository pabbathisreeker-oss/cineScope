import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Film } from 'lucide-react';
import MovieCard from '@/features/movies/components/MovieCard';
import type { Movie } from '@/types/tmdb';

interface SearchResultsProps {
  movies: Movie[];
  totalCount: number;
  searchQuery?: string;
  activeFilterCount?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  movies,
  totalCount,
  searchQuery,
  activeFilterCount = 0,
}) => {
  // Track favorite movie IDs locally for card interaction
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-4 my-6">
      {/* Results Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
          <Film className="h-4 w-4 text-primary" />
          <span>
            Found <strong className="text-white font-bold">{totalCount}</strong> {totalCount === 1 ? 'movie' : 'movies'}
            {searchQuery && (
              <>
                {' '}
                for <span className="text-primary font-semibold">"{searchQuery}"</span>
              </>
            )}
          </span>
        </div>

        {activeFilterCount > 0 && (
          <span className="text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-white/10">
            {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
          </span>
        )}
      </div>

      {/* Staggered Motion Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${searchQuery}-${totalCount}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants} layout>
              <MovieCard
                movie={movie}
                isFavorite={favoriteIds.has(movie.id)}
                onFavoriteToggle={(e) => toggleFavorite(e, movie.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
