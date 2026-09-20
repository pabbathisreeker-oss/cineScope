import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RotateCcw, X, SlidersHorizontal, ChevronDown, Compass, Star } from 'lucide-react';
import movieService from '@/services/movieService';
import { useDiscoverMovies, useMovieGenres } from '@/hooks/useDiscoverMovies';
import type { Movie } from '@/types/tmdb';
import MovieCard from '@/features/movies/components/MovieCard';
import { Skeleton } from '@/components/ui/Feedback';
import Button from '@/components/ui/Button';

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Popularity' },
  { id: 'vote_average.desc', label: 'Top Rated' },
  { id: 'primary_release_date.desc', label: 'Newest' },
  { id: 'primary_release_date.asc', label: 'Oldest' },
];

const LANGUAGES = [
  { code: 'all', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ko', label: 'Korean' },
];

const YEARS = ['all', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2010'];

const RATINGS = [
  { value: 0, label: 'Any Rating' },
  { value: 8, label: '8.0+ ★ (Masterpiece)' },
  { value: 7, label: '7.0+ ★ (Great)' },
  { value: 6, label: '6.0+ ★ (Good)' },
];

export const DiscoverPage: React.FC = () => {
  const location = useLocation();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');

  const [extraMovies, setExtraMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // 1. Fetch Genres using React Query
  const { data: genres = [] } = useMovieGenres();

  // 2. Fetch Initial Discover Movies using React Query
  const { data: initialMovies = [], isLoading } = useDiscoverMovies({
    genre: selectedGenre,
    year: selectedYear,
    language: selectedLanguage,
    rating: minRating,
    sortBy,
    page: 1,
  });

  // Reset extra loaded movies on filter change or route navigation
  useEffect(() => {
    setExtraMovies([]);
    setPage(1);
    setHasMore(true);
  }, [selectedGenre, selectedYear, selectedLanguage, minRating, sortBy, location.pathname]);

  const movies = [...initialMovies, ...extraMovies];

  // Load More Handler
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const newMovies = await movieService.discoverMovies({
        genre: selectedGenre,
        year: selectedYear,
        language: selectedLanguage,
        rating: minRating,
        sortBy,
        page: nextPage,
      });

      if (newMovies.length > 0) {
        setExtraMovies((prev) => [...prev, ...newMovies]);
        setPage(nextPage);
        setHasMore(newMovies.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedLanguage('all');
    setMinRating(0);
    setSortBy('popularity.desc');
  };

  const isFiltered =
    selectedGenre !== 'all' ||
    selectedYear !== 'all' ||
    selectedLanguage !== 'all' ||
    minRating > 0 ||
    sortBy !== 'popularity.desc';

  // Filter controls JSX
  const FilterControls = () => (
    <div className="space-y-6">
      {/* Genre Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Genre
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedGenre === 'all'
                ? 'bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black shadow-glow-gold font-bold scale-[1.02]'
                : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white hover:border-primary/40 hover:bg-white/[0.08]'
            }`}
          >
            All Genres
          </button>
          {genres.map((g) => (
            <button
              type="button"
              key={g.id}
              onClick={() => setSelectedGenre(String(g.id))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedGenre === String(g.id)
                  ? 'bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black shadow-glow-gold font-bold scale-[1.02]'
                  : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white hover:border-primary/40 hover:bg-white/[0.08]'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Sort By
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                sortBy === opt.id
                  ? 'bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black shadow-glow-gold font-bold scale-[1.02]'
                  : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white hover:border-primary/40 hover:bg-white/[0.08]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Release Year */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Release Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full bg-[#0d0d12] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
        >
          <option value="all">All Years</option>
          {YEARS.filter((y) => y !== 'all').map((y) => (
            <option key={y} value={y} className="bg-[#111115] text-white">
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {RATINGS.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setMinRating(r.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                minRating === r.value
                  ? 'bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black shadow-glow-gold font-bold scale-[1.01]'
                  : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white hover:border-primary/40 hover:bg-white/[0.08]'
              }`}
            >
              <span>{r.label}</span>
              {minRating === r.value && <Star className="h-3.5 w-3.5 fill-current text-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-[#0d0d12] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-[#111115] text-white">
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Filters */}
      {isFiltered && (
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-primary hover:text-black border border-white/10 hover:border-primary/40 text-xs font-bold text-white transition-all cursor-pointer shadow-md hover:shadow-glow-gold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full pt-24 pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Explore Catalog
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide font-extrabold text-white">
              Discover Movies
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Filter by genre, year, language, rating, and popularity in real-time.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-surface/80 border border-white/15 text-xs font-bold text-white hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-md"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filters & Sort</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-1 p-6 rounded-3xl glass-panel border border-white/10 shadow-premium sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                  Filters
                </h3>
              </div>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <FilterControls />
          </aside>

          {/* MOBILE DRAWER FILTERS */}
          <AnimatePresence>
            {mobileDrawerOpen && (
              <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-xl flex justify-end">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-full max-w-xs h-full bg-[#0d0d11] p-6 overflow-y-auto space-y-6 shadow-2xl border-l border-white/10"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">Discover Filters</h3>
                    <button
                      type="button"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-2 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <FilterControls />

                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MAIN MOVIE GRID (3 Cols Desktop, 2 Cols Mobile) */}
          <main className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
                ))}
              </div>
            ) : movies.length > 0 ? (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="pt-6 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      rightIcon={<ChevronDown className="h-4 w-4 text-primary" />}
                    >
                      {isLoadingMore ? 'Loading Movies...' : 'Load More Movies'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl glass-panel border border-white/10 shadow-premium">
                <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                  <Filter className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-display uppercase tracking-wider font-extrabold text-white mb-2">
                  No movies match your filters.
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
                  Try clearing some filter criteria or resetting your search to explore more titles.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
