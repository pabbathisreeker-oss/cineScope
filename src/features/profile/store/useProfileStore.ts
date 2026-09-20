import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  memberSince: string;
  favoriteGenre: string;
  moviesWatched: number;
  watchlistCount: number;
  favoritesCount: number;
  hoursWatched: number;
}

export type AccentColor = 'gold' | 'violet' | 'emerald' | 'purple' | 'cyan';

export interface ProfileSettings {
  darkTheme: boolean;
  accentColor: AccentColor;
  recommendationAlerts: boolean;
  newReleaseAlerts: boolean;
  weeklyDigest: boolean;
}

interface ProfileState {
  profile: UserProfile;
  settings: ProfileSettings;
  isEditModalOpen: boolean;
  isPasswordModalOpen: boolean;
  toastMessage: string | null;

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<ProfileSettings>) => void;
  toggleSetting: (key: keyof ProfileSettings) => void;
  setAccentColor: (color: AccentColor) => void;
  setEditModalOpen: (isOpen: boolean) => void;
  setPasswordModalOpen: (isOpen: boolean) => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Vance',
  email: 'alex.vance@cinescope.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  memberSince: 'January 2024',
  favoriteGenre: 'Sci-Fi & Thriller',
  moviesWatched: 142,
  watchlistCount: 24,
  favoritesCount: 38,
  hoursWatched: 320,
};

export const INITIAL_SETTINGS: ProfileSettings = {
  darkTheme: true,
  accentColor: 'gold',
  recommendationAlerts: true,
  newReleaseAlerts: true,
  weeklyDigest: false,
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: INITIAL_PROFILE,
  settings: INITIAL_SETTINGS,
  isEditModalOpen: false,
  isPasswordModalOpen: false,
  toastMessage: null,

  updateProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),

  updateSettings: (data) =>
    set((state) => ({
      settings: { ...state.settings, ...data },
    })),

  toggleSetting: (key) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    })),

  setAccentColor: (accentColor) =>
    set((state) => ({
      settings: { ...state.settings, accentColor },
    })),

  setEditModalOpen: (isEditModalOpen) => set({ isEditModalOpen }),

  setPasswordModalOpen: (isPasswordModalOpen) => set({ isPasswordModalOpen }),

  showToast: (toastMessage) => set({ toastMessage }),

  hideToast: () => set({ toastMessage: null }),
}));

export default useProfileStore;
