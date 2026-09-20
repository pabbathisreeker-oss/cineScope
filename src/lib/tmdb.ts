// CineScope TMDB API Integration & Coverflow Utilities
declare const process: { env: Record<string, string | undefined> } | undefined;

const TMDB_API_KEY =
  (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_TMDB_API_KEY) ||
  import.meta.env.VITE_TMDB_API_KEY ||
  '';
const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMG = (path: string) => `https://image.tmdb.org/t/p/w500${path}`;

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: { name: string }[];
}

export async function fetchTrendingMovies(count = 12): Promise<TMDBMovie[]> {
  try {
    // 1. Direct TMDB API fetch if client-side API key is present
    if (TMDB_API_KEY) {
      const res = await fetch(
        `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.results?.length) {
          return data.results.slice(0, count);
        }
      }
    }

    // 2. Local CineScope Serverless Proxy endpoint (/api/movies/trending)
    const proxyRes = await fetch('/api/movies/trending?timeWindow=week');
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const results: TMDBMovie[] = Array.isArray(data) ? data : (data?.results || []);
      if (results.length > 0) {
        return results.slice(0, count);
      }
    }
  } catch (err) {
    console.warn('Live TMDB trending fetch failed, falling back to curated collection:', err);
  }

  return [];
}

export function toCoverflowSlide(movie: TMDBMovie, _index = 0) {
  const posterUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http')
      ? movie.poster_path
      : TMDB_IMG(movie.poster_path))
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

  return {
    src: posterUrl,
    alt: `${movie.title} poster`,
    title: movie.title,
    subtitle: movie.genres?.[0]?.name ?? 'Trending',
    meta: [
      { label: 'Year', value: movie.release_date?.slice(0, 4) ?? '—' },
      { label: 'Rating', value: movie.vote_average ? movie.vote_average.toFixed(1) : '—' },
      { label: 'Runtime', value: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '—' },
    ],
  };
}

export const FALLBACK_FILMS = [
  {
    src: TMDB_IMG('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    alt: 'Dune: Part Two poster',
    title: 'Dune: Part Two',
    subtitle: 'Sci-Fi • Masterpiece',
    meta: [
      { label: 'Year', value: '2024' },
      { label: 'Rating', value: '8.3' },
      { label: 'Runtime', value: '2h 46m' },
    ],
  },
  {
    src: TMDB_IMG('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    alt: 'Oppenheimer poster',
    title: 'Oppenheimer',
    subtitle: 'Drama • Academy Award Winner',
    meta: [
      { label: 'Year', value: '2023' },
      { label: 'Rating', value: '8.1' },
      { label: 'Runtime', value: '3h 0m' },
    ],
  },
  {
    src: TMDB_IMG('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    alt: 'Interstellar poster',
    title: 'Interstellar',
    subtitle: 'Sci-Fi • Masterpiece',
    meta: [
      { label: 'Year', value: '2014' },
      { label: 'Rating', value: '8.4' },
      { label: 'Runtime', value: '2h 49m' },
    ],
  },
  {
    src: TMDB_IMG('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
    alt: 'The Dark Knight poster',
    title: 'The Dark Knight',
    subtitle: 'Action • Critically Acclaimed',
    meta: [
      { label: 'Year', value: '2008' },
      { label: 'Rating', value: '8.5' },
      { label: 'Runtime', value: '2h 32m' },
    ],
  },
  {
    src: TMDB_IMG('/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'),
    alt: 'Spider-Man: Across the Spider-Verse poster',
    title: 'Spider-Man: Across the Spider-Verse',
    subtitle: 'Animation • Multiverse Phenomenon',
    meta: [
      { label: 'Year', value: '2023' },
      { label: 'Rating', value: '8.4' },
      { label: 'Runtime', value: '2h 20m' },
    ],
  },
  {
    src: TMDB_IMG('/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'),
    alt: 'Inception poster',
    title: 'Inception',
    subtitle: 'Sci-Fi • Mind-Bending',
    meta: [
      { label: 'Year', value: '2010' },
      { label: 'Rating', value: '8.4' },
      { label: 'Runtime', value: '2h 28m' },
    ],
  },
  {
    src: TMDB_IMG('/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'),
    alt: 'John Wick: Chapter 4 poster',
    title: 'John Wick: Chapter 4',
    subtitle: 'Action • Relentless',
    meta: [
      { label: 'Year', value: '2023' },
      { label: 'Rating', value: '7.7' },
      { label: 'Runtime', value: '2h 49m' },
    ],
  },
  {
    src: TMDB_IMG('/7fn624j5lj3xTme2SgiLCeuedmO.jpg'),
    alt: 'Whiplash poster',
    title: 'Whiplash',
    subtitle: 'Drama • Award Winner',
    meta: [
      { label: 'Year', value: '2014' },
      { label: 'Rating', value: '8.4' },
      { label: 'Runtime', value: '1h 46m' },
    ],
  },
  {
    src: TMDB_IMG('/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'),
    alt: 'Blade Runner 2049 poster',
    title: 'Blade Runner 2049',
    subtitle: 'Sci-Fi • Neo-Noir',
    meta: [
      { label: 'Year', value: '2017' },
      { label: 'Rating', value: '7.9' },
      { label: 'Runtime', value: '2h 44m' },
    ],
  },
  {
    src: TMDB_IMG('/74xTEgt7R36Fpooo50r9T25onhq.jpg'),
    alt: 'The Batman poster',
    title: 'The Batman',
    subtitle: 'Crime • Noir Thriller',
    meta: [
      { label: 'Year', value: '2022' },
      { label: 'Rating', value: '7.7' },
      { label: 'Runtime', value: '2h 56m' },
    ],
  },
  {
    src: TMDB_IMG('/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg'),
    alt: 'Turning Red poster',
    title: 'Turning Red',
    subtitle: 'Animation • Family Comedy',
    meta: [
      { label: 'Year', value: '2022' },
      { label: 'Rating', value: '7.4' },
      { label: 'Runtime', value: '1h 40m' },
    ],
  },
  {
    src: TMDB_IMG('/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg'),
    alt: 'Coco poster',
    title: 'Coco',
    subtitle: 'Animation • Family Favorite',
    meta: [
      { label: 'Year', value: '2017' },
      { label: 'Rating', value: '8.2' },
      { label: 'Runtime', value: '1h 45m' },
    ],
  },
];

export default fetchTrendingMovies;

