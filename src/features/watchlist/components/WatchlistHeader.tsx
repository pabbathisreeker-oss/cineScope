import React from 'react';
import { motion } from 'framer-motion';
import { Film, ArrowUpDown, Trash2 } from 'lucide-react';
import FilterChip from '@/features/search/components/FilterChip';
import type { FilterStatus, SortOption } from '../store/useWatchlistStore';

interface WatchlistHeaderProps {
  totalCount: number;
  watchedCount: number;
  unwatchedCount: number;
  filterStatus: FilterStatus;
  sortBy: SortOption;
  onFilterChange: (status: FilterStatus) => void;
  onSortChange: (sortBy: SortOption) => void;
  onClearAll: () => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'added_desc', label: 'Recently Added' },
  { id: 'rating_desc', label: 'Highest Rated' },
  { id: 'year_desc', label: 'Newest Release' },
  { id: 'title_asc', label: 'Title (A-Z)' },
];

export const WatchlistHeader: React.FC<WatchlistHeaderProps> = ({
  totalCount,
  watchedCount,
  unwatchedCount,
  filterStatus,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearAll,
}) => {
  return (
    <div className="w-full space-y-6 select-none">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
            <Film className="h-3.5 w-3.5" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-wide font-extrabold text-white flex items-center space-x-3">
            <span>Your Watchlist</span>
            {totalCount > 0 && (
              <span className="text-base md:text-xl font-sans font-bold px-3 py-0.5 rounded-full bg-primary text-primary-foreground shadow-glow-gold">
                {totalCount}
              </span>
            )}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1.5 max-w-xl">
            Track, curate, and experience your saved cinematic titles.
          </p>
        </div>

        {totalCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClearAll}
            className="self-start md:self-auto flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-destructive/10 border border-white/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Watchlist</span>
          </motion.button>
        )}
      </div>

      {/* Filter Chips & Sort Controls */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Filter Chips (All, Watched, Unwatched) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <FilterChip
              label="All Titles"
              isActive={filterStatus === 'all'}
              count={totalCount}
              onClick={() => onFilterChange('all')}
            />
            <FilterChip
              label="Watched"
              isActive={filterStatus === 'watched'}
              count={watchedCount}
              onClick={() => onFilterChange('watched')}
            />
            <FilterChip
              label="Unwatched"
              isActive={filterStatus === 'unwatched'}
              count={unwatchedCount}
              onClick={() => onFilterChange('unwatched')}
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-[#0d0d12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#111115] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistHeader;
