import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import CinemaLayout from '@/layouts/CinemaLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Loader from '@/components/feedback/Loader';
import PATHS from './paths';

// Lazy load pages for optimized bundle splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const BrowsePage = lazy(() => import('@/pages/BrowsePage'));
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: PATHS.LANDING,
    element: (
      <Suspense fallback={<Loader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: PATHS.SIGN_IN,
    element: (
      <Suspense fallback={<Loader />}>
        <SignInPage />
      </Suspense>
    ),
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: (
          <Suspense fallback={<Loader />}>
            <BrowsePage />
          </Suspense>
        ),
      },
      {
        path: PATHS.DISCOVER,
        element: (
          <Suspense fallback={<Loader />}>
            <DiscoverPage />
          </Suspense>
        ),
      },
      {
        path: PATHS.SEARCH,
        element: (
          <Suspense fallback={<Loader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: PATHS.WATCHLIST,
        element: (
          <Suspense fallback={<Loader />}>
            <WatchlistPage />
          </Suspense>
        ),
      },
      {
        path: PATHS.FAVORITES,
        element: (
          <Suspense fallback={<Loader />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATHS.PROFILE,
            element: (
              <Suspense fallback={<Loader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <CinemaLayout />,
    children: [
      {
        path: PATHS.MOVIE_DETAILS,
        element: (
          <Suspense fallback={<Loader />}>
            <MovieDetailPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;


