import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/features/search/store/useSearchStore';
import movieService from '@/services/movieService';
import useSearchMovies from '@/hooks/useSearchMovies';
import SearchBar from '@/features/search/components/SearchBar';
import FilterPanel from '@/features/search/components/FilterPanel';
import SearchResults from '@/features/search/components/SearchResults';
import EmptyState from '@/features/search/components/EmptyState';
import NoResults from '@/features/search/components/NoResults';
import LoadingGrid from '@/features/search/components/LoadingGrid';
import ErrorState from '@/features/search/components/ErrorState';
import type { Movie } from '@/types/tmdb';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    resetFilters,
    addToHistory,
  } = useSearchStore();

  // Synchronize URL query param with store searchQuery on initial mount or URL change
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery, setSearchQuery]);

  // 1. Fetch live TMDB search results when query exists
  const { data: searchResults = [], isLoading: isSearchLoading, error: searchError } = useSearchMovies(searchQuery);

  // 2. Fetch live TMDB popular movies for empty state / initial discovery grid
  const { data: popularMovies = [], isLoading: isPopularLoading, error: popularError } = useQuery<Movie[]>({
    queryKey: ['movies', 'popular', 'search-fallback'],
    queryFn: () => movieService.getPopularMovies(),
    staleTime: 1000 * 60 * 15,
  });

  const isLoading = isSearchLoading || (searchQuery.trim() === '' && isPopularLoading);
  const error = (searchError?.message || popularError?.message || null);

  // Sync searchQuery changes back to URL search params
  const handleQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery }, { replace: true });
      addToHistory(newQuery);
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Base movie list (live search results if query typed, otherwise popular TMDB movies)
  const baseMovies = searchQuery.trim() ? searchResults : popularMovies;

  // Filter and sort movies according to filters state
  const filteredMovies = useMemo(() => {
    return baseMovies
      .filter((movie) => {
        // Genre filter
        if (filters.genre !== 'all') {
          const genreId = parseInt(filters.genre, 10);
          if (!isNaN(genreId) && (!movie.genre_ids || !movie.genre_ids.includes(genreId))) {
            return false;
          }
        }

        // Year filter
        if (filters.year !== 'all' && movie.release_date) {
          const year = new Date(movie.release_date).getFullYear();
          if (filters.year === '2024' && year !== 2024) return false;
          if (filters.year === '2023' && year !== 2023) return false;
          if (filters.year === '2020-2022' && (year < 2020 || year > 2022)) return false;
          if (filters.year === '2010s' && (year < 2010 || year > 2019)) return false;
          if (filters.year === 'classics' && year >= 2000) return false;
        }

        // IMDb / Vote Rating Filter
        if (filters.rating > 0 && movie.vote_average < filters.rating) {
          return false;
        }

        // Language Filter
        if (filters.language !== 'all' && movie.original_language && movie.original_language.toLowerCase() !== filters.language.toLowerCase()) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating_desc':
            return b.vote_average - a.vote_average;
          case 'date_desc':
            return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
          case 'date_asc':
            return new Date(a.release_date || 0).getTime() - new Date(b.release_date || 0).getTime();
          case 'title_asc':
            return a.title.localeCompare(b.title);
          case 'popularity':
          default:
            return b.popularity - a.popularity;
        }
      });
  }, [baseMovies, filters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.genre !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.rating > 0) count++;
    if (filters.language !== 'all') count++;
    if (filters.runtime !== 'all') count++;
    if (filters.sortBy !== 'popularity') count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0;

  // Category select handler for EmptyState quick discovery pills
  const handleCategorySelect = (categoryQuery: string) => {
    if (categoryQuery.startsWith('rating:')) {
      const minRating = parseFloat(categoryQuery.split(':')[1]);
      setFilter('rating', minRating);
      setSearchQuery('');
    } else if (categoryQuery === 'Sci-Fi' || categoryQuery === 'Action') {
      setFilter('genre', categoryQuery === 'Sci-Fi' ? '878' : '28');
      setSearchQuery('');
    } else {
      handleQueryChange(categoryQuery);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col"
    >
      {/* 1. Large Hero Search Area */}
      <SearchBar
        value={searchQuery}
        onChange={handleQueryChange}
        onSubmit={handleQueryChange}
        onClear={() => handleQueryChange('')}
        onTagClick={(tag) => handleQueryChange(tag)}
      />

      {/* 2. Reusable Filter Components Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilter}
        onReset={() => {
          resetFilters();
          handleQueryChange('');
        }}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* 3. Conditional State Rendering */}
      {isLoading ? (
        <LoadingGrid count={10} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => handleQueryChange(searchQuery)} />
      ) : searchQuery.trim() === '' && activeFilterCount === 0 ? (
        <div className="space-y-8">
          <EmptyState onSelectCategory={handleCategorySelect} />

          {/* Default Popular TMDB Grid when initial search page opens */}
          <div className="pt-6">
            <SearchResults
              movies={popularMovies}
              totalCount={popularMovies.length}
              searchQuery=""
              activeFilterCount={0}
            />
          </div>
        </div>
      ) : filteredMovies.length > 0 ? (
        <SearchResults
          movies={filteredMovies}
          totalCount={filteredMovies.length}
          searchQuery={searchQuery}
          activeFilterCount={activeFilterCount}
        />
      ) : (
        <NoResults
          query={searchQuery}
          onResetFilters={resetFilters}
          onClearSearch={() => handleQueryChange('')}
          recommendedMovies={popularMovies.slice(0, 5)}
        />
      )}
    </motion.div>
  );
};

export default SearchPage;
