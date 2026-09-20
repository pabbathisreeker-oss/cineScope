import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ArrowUpDown } from 'lucide-react';
import useWatchlistStore from '@/features/watchlist/store/useWatchlistStore';
import MovieCard from '@/features/movies/components/MovieCard';
import Button from '@/components/ui/Button';
import PATHS from '@/routes/paths';

export const FavoritesPage: React.FC = () => {
  const { items } = useWatchlistStore();
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'year'>('rating');

  // Filter items where isFavorite is true
  const favoriteItems = items.filter((item) => item.isFavorite);

  // Sort favorites
  const sortedFavorites = [...favoriteItems].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.movie.vote_average - a.movie.vote_average;
    }
    if (sortBy === 'title') {
      return a.movie.title.localeCompare(b.movie.title);
    }
    if (sortBy === 'year') {
      const yearA = a.movie.release_date ? new Date(a.movie.release_date).getFullYear() : 0;
      const yearB = b.movie.release_date ? new Date(b.movie.release_date).getFullYear() : 0;
      return yearB - yearA;
    }
    return 0;
  });

  return (
    <div className="min-h-screen w-full pt-24 pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/25 text-accent">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                Personal Collection
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide font-extrabold text-white">
              Favorite Movies
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {favoriteItems.length} {favoriteItems.length === 1 ? 'film' : 'films'} in your hall of fame
            </p>
          </div>

          {/* Sort Control */}
          {favoriteItems.length > 0 && (
            <div className="flex items-center space-x-2 bg-surface/60 border border-white/10 rounded-xl p-1.5 backdrop-blur-md">
              <ArrowUpDown className="h-3.5 w-3.5 text-text-muted ml-2" />
              <span className="text-xs text-text-muted font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
              >
                <option value="rating" className="bg-zinc-900 text-white">Top Rated</option>
                <option value="title" className="bg-zinc-900 text-white">Title (A-Z)</option>
                <option value="year" className="bg-zinc-900 text-white">Release Year</option>
              </select>
            </div>
          )}
        </div>

        {/* Favorites Grid */}
        {sortedFavorites.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {sortedFavorites.map((item) => (
                <motion.div
                  key={item.movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard movie={item.movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto p-8 rounded-3xl glass-panel border border-white/10 shadow-premium"
          >
            <div className="p-4 rounded-full bg-accent/15 border border-accent/25 text-accent mb-4">
              <Heart className="h-10 w-10 stroke-accent fill-accent/30" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide font-extrabold text-white mb-2">
              No favorite movies yet.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
              Tap the heart icon on any movie card or detail page to save it to your personal hall of fame.
            </p>

            <Link to={PATHS.SEARCH}>
              <Button variant="primary" size="md" leftIcon={<Search className="h-4 w-4" />}>
                Explore Movies
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
