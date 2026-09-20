import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Movie data doesn't change by the second, cache it for 5 minutes
      staleTime: 1000 * 60 * 5, 
      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Avoid refetching when window gains focus to prevent hitting API limits
      refetchOnWindowFocus: false,
      // Retry failed queries once before displaying error UI
      retry: 1,
      // Refetch on reconnect automatically
      refetchOnReconnect: true,
    },
  },
});

export default queryClient;
