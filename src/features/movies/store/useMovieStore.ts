import { create } from 'zustand';

interface MovieState {
  activeGenreId: number | null;
  activeSortBy: string;
  viewMode: 'grid' | 'list';
  setActiveGenreId: (genreId: number | null) => void;
  setActiveSortBy: (sortBy: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  activeGenreId: null,
  activeSortBy: 'popularity.desc',
  viewMode: 'grid',
  
  setActiveGenreId: (genreId) => set({ activeGenreId: genreId }),
  setActiveSortBy: (sortBy) => set({ activeSortBy: sortBy }),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ activeGenreId: null, activeSortBy: 'popularity.desc' }),
}));

export default useMovieStore;
