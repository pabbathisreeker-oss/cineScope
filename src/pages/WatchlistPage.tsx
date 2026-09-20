import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWatchlistStore } from '@/features/watchlist/store/useWatchlistStore';
import WatchlistHeader from '@/features/watchlist/components/WatchlistHeader';
import WatchlistStats from '@/features/watchlist/components/WatchlistStats';
import WatchlistGrid from '@/features/watchlist/components/WatchlistGrid';
import EmptyWatchlist from '@/features/watchlist/components/EmptyWatchlist';
import { Sparkles, RotateCcw } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const {
    items,
    filterStatus,
    sortBy,
    setFilterStatus,
    setSortBy,
    toggleWatched,
    toggleFavorite,
    removeFromWatchlist,
    clearWatchlist,
  } = useWatchlistStore();

  const totalCount = items.length;
  const watchedCount = items.filter((i) => i.isWatched).length;
  const unwatchedCount = totalCount - watchedCount;

  // Filter items based on active status filter
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filterStatus === 'watched') {
      result = result.filter((i) => i.isWatched);
    } else if (filterStatus === 'unwatched') {
      result = result.filter((i) => !i.isWatched);
    }

    // Sort items
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc':
          return b.movie.vote_average - a.movie.vote_average;
        case 'year_desc': {
          const yearA = a.movie.release_date ? new Date(a.movie.release_date).getFullYear() : 0;
          const yearB = b.movie.release_date ? new Date(b.movie.release_date).getFullYear() : 0;
          return yearB - yearA;
        }
        case 'title_asc':
          return a.movie.title.localeCompare(b.movie.title);
        case 'added_desc':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });
  }, [items, filterStatus, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col"
    >
      {/* 1. Top Header Section */}
      <WatchlistHeader
        totalCount={totalCount}
        watchedCount={watchedCount}
        unwatchedCount={unwatchedCount}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onFilterChange={setFilterStatus}
        onSortChange={setSortBy}
        onClearAll={clearWatchlist}
      />

      {/* 2. Main Body Content */}
      {totalCount === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="space-y-6">
          {/* Stats Bar */}
          <WatchlistStats items={items} />

          {/* Grid of Saved Movies */}
          {filteredItems.length > 0 ? (
            <WatchlistGrid
              items={filteredItems}
              onToggleWatched={toggleWatched}
              onToggleFavorite={toggleFavorite}
              onRemove={removeFromWatchlist}
            />
          ) : (
            /* Filter Status Empty State (e.g. No Watched Movies) */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center select-none"
            >
              <div className="p-8 rounded-3xl bg-surface/60 border border-white/10 backdrop-blur-xl max-w-md mx-auto">
                <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-display uppercase tracking-wider font-bold text-white mb-2">
                  No {filterStatus === 'watched' ? 'Watched' : 'Unwatched'} Movies
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  You don't have any movies marked as {filterStatus} in your watchlist.
                </p>
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-glow-gold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Show All Movies</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WatchlistPage;
