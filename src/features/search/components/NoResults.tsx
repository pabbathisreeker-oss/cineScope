import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';
import MovieCard from '@/features/movies/components/MovieCard';
import type { Movie } from '@/types/tmdb';

interface NoResultsProps {
  query: string;
  onResetFilters: () => void;
  onClearSearch: () => void;
  recommendedMovies?: Movie[];
}

export const NoResults: React.FC<NoResultsProps> = ({
  query,
  onResetFilters,
  onClearSearch,
  recommendedMovies = [],
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full py-12 flex flex-col items-center select-none"
    >
      {/* Glassmorphic Illustration Container */}
      <div className="relative p-8 rounded-3xl bg-surface/60 border border-white/10 backdrop-blur-xl text-center max-w-lg mx-auto shadow-premium mb-12">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-glow-gold">
          <SearchX className="h-8 w-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider font-bold text-white mb-2">
          No Movies Found
        </h2>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {query ? (
            <>
              We couldn't find any titles matching <span className="text-white font-semibold">"{query}"</span>.
            </>
          ) : (
            'No movies match your active filter combination.'
          )}
          <br />
          Try checking for spelling errors, searching by director, or clearing your active filters.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onResetFilters}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black text-xs font-bold shadow-glow-gold hover:brightness-105 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </motion.button>

          {query && (
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClearSearch}
              className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              Clear Search Term
            </motion.button>
          )}
        </div>
      </div>

      {/* Recommended Fallback Section */}
      {recommendedMovies.length > 0 && (
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">
              Popular Movies You Might Enjoy
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recommendedMovies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NoResults;
