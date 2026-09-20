import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CheckCircle2, Trash2 } from 'lucide-react';
import MovieCard from '@/features/movies/components/MovieCard';
import type { WatchlistItem } from '../store/useWatchlistStore';

interface WatchlistGridProps {
  items: WatchlistItem[];
  onToggleWatched: (movieId: number) => void;
  onToggleFavorite: (movieId: number) => void;
  onRemove: (movieId: number) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

export const WatchlistGrid: React.FC<WatchlistGridProps> = ({
  items,
  onToggleWatched,
  onToggleFavorite,
  onRemove,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 my-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const { movie, isWatched, isFavorite } = item;
          return (
            <motion.div
              key={movie.id}
              layout
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative group flex flex-col"
            >
              {/* Top-Left Watched Status Badge */}
              {isWatched && (
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)] backdrop-blur-md">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Watched</span>
                  </div>
                </div>
              )}

              {/* Reused MovieCard component */}
              <div className="relative">
                <MovieCard
                  movie={movie}
                  isFavorite={isFavorite}
                  onFavoriteToggle={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(movie.id);
                  }}
                />

                {/* Additional Watchlist Quick Action Controls Overlay Bar */}
                <div className="absolute bottom-16 right-2 z-20 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Mark Watched / Unwatched Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatched(movie.id);
                    }}
                    className={`p-2 rounded-full border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                      isWatched
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'bg-black/70 text-text-secondary hover:text-emerald-400 border-white/20 hover:border-emerald-400/50'
                    }`}
                    title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                    aria-label={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </motion.button>

                  {/* Remove from Watchlist Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(movie.id);
                    }}
                    className="p-2 rounded-full bg-black/70 hover:bg-destructive text-text-secondary hover:text-destructive-foreground border border-white/20 hover:border-destructive/80 backdrop-blur-md shadow-lg transition-all cursor-pointer"
                    title="Remove from Watchlist"
                    aria-label="Remove from Watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default WatchlistGrid;
