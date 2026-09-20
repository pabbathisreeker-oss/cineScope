import axios, { type AxiosError } from 'axios';

// Environment variable configuration
export const TMDB_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Check if the application should run in mock mode
 */
export const isMockMode = (): boolean => {
  return USE_MOCK_DATA;
};

/**
 * Dedicated Axios Client Instance for Serverless API Proxy
 */
export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Response Interceptor: Global Error Interception & Handling
tmdbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorMessage = 'Failed to fetch data from CineScope API Services.';

    if (error.response) {
      const data = error.response.data as { status_message?: string; message?: string; error?: string };
      errorMessage = data?.error || data?.status_message || data?.message || `API responded with error code ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Network error: Unable to reach CineScope API backend. Please check your connection.';
    }

    const normalizedError = new Error(errorMessage);
    (normalizedError as unknown as Record<string, unknown>).status = error.response?.status;
    (normalizedError as unknown as Record<string, unknown>).originalError = error;

    return Promise.reject(normalizedError);
  }
);

export default tmdbClient;
