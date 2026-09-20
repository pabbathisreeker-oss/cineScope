import { create } from 'zustand';

export interface FilterState {
  genre: string; // 'all' or numeric string genre ID or name
  year: string; // 'all' | '2024' | '2023' | '2020-2022' | '2010s' | 'classics'
  rating: number; // 0 | 7.0 | 7.5 | 8.0 | 8.5
  sortBy: string; // 'popularity' | 'rating_desc' | 'date_desc' | 'date_asc' | 'title_asc'
  language: string; // 'all' | 'en' | 'ja' | 'hi' | 'ko' | 'fr' | 'es'
  runtime: string; // 'all' | 'under_90' | '90_120' | '120_150' | 'over_150'
}

export const DEFAULT_FILTERS: FilterState = {
  genre: 'all',
  year: 'all',
  rating: 0,
  sortBy: 'popularity',
  language: 'all',
  runtime: 'all',
};

interface SearchState {
  searchQuery: string;
  isSearchOpen: boolean;
  searchHistory: string[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
  resetSearch: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  isSearchOpen: false,
  searchHistory: ['Dune: Part Two', 'Oppenheimer', 'Christopher Nolan', 'Sci-Fi'],
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  addToHistory: (query) =>
    set((state) => {
      const cleanQuery = query.trim();
      if (!cleanQuery) return state;
      const filtered = state.searchHistory.filter((q) => q.toLowerCase() !== cleanQuery.toLowerCase());
      return { searchHistory: [cleanQuery, ...filtered].slice(0, 10) };
    }),

  clearHistory: () => set({ searchHistory: [] }),

  removeFromHistory: (query) =>
    set((state) => ({
      searchHistory: state.searchHistory.filter((q) => q !== query),
    })),

  resetSearch: () =>
    set({
      searchQuery: '',
      filters: { ...DEFAULT_FILTERS },
      error: null,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useSearchStore;
