import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Movie } from '@/types/tmdb';

export interface WatchlistItem {
  movie: Movie;
  addedAt: string; // ISO date string
  isWatched: boolean;
  isFavorite: boolean;
}

export type FilterStatus = 'all' | 'watched' | 'unwatched';
export type SortOption = 'added_desc' | 'rating_desc' | 'title_asc' | 'year_desc';

interface WatchlistState {
  items: WatchlistItem[];
  filterStatus: FilterStatus;
  sortBy: SortOption;

  // Actions
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatched: (movieId: number) => void;
  toggleFavorite: (movieId: number) => void;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
  setFilterStatus: (status: FilterStatus) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      filterStatus: 'all',
      sortBy: 'added_desc',

      addToWatchlist: (movie) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.movie.id === movie.id);
          if (existingIndex >= 0) {
            // Already in list, do not duplicate
            return state;
          }
          const newItem: WatchlistItem = {
            movie,
            addedAt: new Date().toISOString(),
            isWatched: false,
            isFavorite: false,
          };
          return { items: [newItem, ...state.items] };
        }),

      removeFromWatchlist: (movieId) =>
        set((state) => ({
          items: state.items.filter((item) => item.movie.id !== movieId),
        })),

      toggleWatched: (movieId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.movie.id === movieId ? { ...item, isWatched: !item.isWatched } : item
          ),
        })),

      toggleFavorite: (movieId) =>
        set((state) => {
          const item = state.items.find((i) => i.movie.id === movieId);
          if (item) {
            return {
              items: state.items.map((i) =>
                i.movie.id === movieId ? { ...i, isFavorite: !i.isFavorite } : i
              ),
            };
          }
          return state;
        }),

      addToFavorites: (movie) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.movie.id === movie.id);
          if (existingIndex >= 0) {
            return {
              items: state.items.map((item) =>
                item.movie.id === movie.id ? { ...item, isFavorite: true } : item
              ),
            };
          }
          // Add new item with isFavorite: true
          const newItem: WatchlistItem = {
            movie,
            addedAt: new Date().toISOString(),
            isWatched: false,
            isFavorite: true,
          };
          return { items: [newItem, ...state.items] };
        }),

      removeFromFavorites: (movieId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.movie.id === movieId ? { ...item, isFavorite: false } : item
          ),
        })),

      isFavorite: (movieId) => {
        const item = get().items.find((i) => i.movie.id === movieId);
        return Boolean(item?.isFavorite);
      },

      isInWatchlist: (movieId) => {
        return get().items.some((i) => i.movie.id === movieId);
      },

      setFilterStatus: (status) => set({ filterStatus: status }),

      setSortBy: (sortBy) => set({ sortBy }),

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: 'cinescope_user_watchlist_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWatchlistStore;
