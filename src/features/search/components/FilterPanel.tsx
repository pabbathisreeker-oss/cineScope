import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RotateCcw, ChevronDown, Star, Calendar, Globe, Clock, ArrowUpDown } from 'lucide-react';
import FilterChip from './FilterChip';
import type { FilterState } from '../store/useSearchStore';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const GENRE_OPTIONS = [
  { id: 'all', label: 'All Genres' },
  { id: '878', label: 'Sci-Fi' },
  { id: '28', label: 'Action' },
  { id: '18', label: 'Drama' },
  { id: '35', label: 'Comedy' },
  { id: '16', label: 'Animation' },
  { id: '12', label: 'Adventure' },
  { id: '80', label: 'Crime' },
  { id: '27', label: 'Horror' },
  { id: '10749', label: 'Romance' },
  { id: '53', label: 'Thriller' },
];

const YEAR_OPTIONS = [
  { id: 'all', label: 'All Years' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2020-2022', label: '2020 - 2022' },
  { id: '2010s', label: '2010s' },
  { id: 'classics', label: 'Classics (<2000)' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings' },
  { value: 8.5, label: '★ 8.5+ Top Tier' },
  { value: 8.0, label: '★ 8.0+ Acclaimed' },
  { value: 7.5, label: '★ 7.5+ Great' },
  { value: 7.0, label: '★ 7.0+ Good' },
];

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Most Popular' },
  { id: 'rating_desc', label: 'Highest Rated' },
  { id: 'date_desc', label: 'Newest First' },
  { id: 'date_asc', label: 'Oldest First' },
  { id: 'title_asc', label: 'Title (A-Z)' },
];

const LANGUAGE_OPTIONS = [
  { id: 'all', label: 'All Languages' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: 'Japanese' },
  { id: 'hi', label: 'Hindi' },
  { id: 'ko', label: 'Korean' },
  { id: 'fr', label: 'French' },
];

const RUNTIME_OPTIONS = [
  { id: 'all', label: 'All Runtimes' },
  { id: 'under_90', label: '< 90 min' },
  { id: '90_120', label: '90 - 120 min' },
  { id: '120_150', label: '120 - 150 min' },
  { id: 'over_150', label: '> 150 min' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full space-y-4 my-6 select-none">
      {/* Primary Genre Chips Row */}
      <div className="flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {GENRE_OPTIONS.map((g) => (
            <FilterChip
              key={g.id}
              label={g.label}
              isActive={filters.genre === g.id}
              onClick={() => onFilterChange('genre', g.id)}
            />
          ))}
        </div>

        {/* Toggle Advanced Filters Button */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              isExpanded || activeFilterCount > 0
                ? 'bg-primary/15 border-primary/50 text-white'
                : 'bg-surface/80 border-white/10 text-text-secondary hover:text-white hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-primary' : ''
              }`}
            />
          </motion.button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline">Reset</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filter Options Container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 rounded-2xl bg-surface/60 border border-white/[0.08] backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Sort By Dropdown */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                  <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                  <span>Sort By</span>
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
                  className="w-full bg-[#030B1B]/90 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0B132B] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. IMDb Rating Filter */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-rating-star fill-rating-star" />
                  <span>Min Rating</span>
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => onFilterChange('rating', parseFloat(e.target.value))}
                  className="w-full bg-[#030B1B]/90 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {RATING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0B132B] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Release Year Filter */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  <span>Release Year</span>
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => onFilterChange('year', e.target.value)}
                  className="w-full bg-[#030B1B]/90 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {YEAR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0B132B] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Language Filter */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Language</span>
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => onFilterChange('language', e.target.value)}
                  className="w-full bg-[#030B1B]/90 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0B132B] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Runtime Filter */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span>Runtime</span>
                </label>
                <select
                  value={filters.runtime}
                  onChange={(e) => onFilterChange('runtime', e.target.value)}
                  className="w-full bg-[#030B1B]/90 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {RUNTIME_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0B132B] text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
