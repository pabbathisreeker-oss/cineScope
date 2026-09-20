import type { Movie, Genre } from '@/types/tmdb';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface MovieCollection {
  id: number;
  name: string;
  posterPath: string | null;
  backdropPath: string | null;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt?: string;
}

export interface WatchProviderItem {
  id: number;
  name: string;
  logoPath: string | null;
}

export interface WatchProvidersData {
  countryCode: string;
  link?: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
}

export interface MovieReview {
  id: string;
  author: string;
  avatarPath: string | null;
  rating?: number | null;
  createdAt: string;
  content: string;
  url?: string;
}

export interface DetailedMovieData {
  id: number;
  title: string;
  originalTitle?: string;
  tagline: string | null;
  overview: string;
  backdropPath: string;
  posterPath: string;
  voteAverage: number;
  voteCount: number;
  popularity?: number;
  releaseYear: number | string;
  releaseDate: string;
  runtime: number;
  certification?: string;
  genres: Genre[];
  director: CrewMember;
  writers: CrewMember[];
  cast: CastMember[];
  crew?: CrewMember[];
  budget: number;
  revenue: number;
  status: string;
  originalLanguage: string;
  spokenLanguages: string[];
  productionCompanies: ProductionCompany[];
  productionCountries?: string[];
  homepage?: string | null;
  adult?: boolean;
  collection?: MovieCollection | null;
  keywords?: string[];
  trailerYoutubeId: string;
  videos?: MovieVideo[];
  screenshots: string[];
  galleryImages?: { backdrops: string[]; posters: string[] };
  watchProviders?: WatchProvidersData | null;
  reviews?: MovieReview[];
  imdbId: string;
  accentColor?: string;
  similarMovies?: Movie[];
  recommendations?: Movie[];
}

import { MOCK_MOVIES, GENRE_MAP } from './mockMovies';

/**
 * Fallback detailed movie object matching mock movies or default
 */
export const getMovieDetailsById = (id: string | number): DetailedMovieData | null => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const found = MOCK_MOVIES.find((m) => m.id === numericId) || MOCK_MOVIES[0];

  const posterPath = found.poster_path
    ? (found.poster_path.startsWith('http') ? found.poster_path : `https://image.tmdb.org/t/p/w500${found.poster_path}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

  const backdropPath = found.backdrop_path
    ? (found.backdrop_path.startsWith('http') ? found.backdrop_path : `https://image.tmdb.org/t/p/original${found.backdrop_path}`)
    : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop';

  const genres: Genre[] = (found.genre_ids || [878, 12]).map((gid) => ({
    id: gid,
    name: GENRE_MAP[gid] || 'Sci-Fi',
  }));

  const similarMovies = MOCK_MOVIES.filter((m) => m.id !== found.id).slice(0, 6);

  return {
    id: !isNaN(numericId) && numericId > 0 ? numericId : found.id,
    title: found.title,
    originalTitle: found.original_title,
    tagline: 'Beyond fear, destiny awaits.',
    overview: found.overview,
    backdropPath,
    posterPath,
    voteAverage: found.vote_average,
    voteCount: found.vote_count,
    popularity: found.popularity,
    releaseYear: found.release_date ? new Date(found.release_date).getFullYear() : 2024,
    releaseDate: found.release_date || '2024-01-01',
    runtime: 148,
    certification: 'PG-13',
    genres,
    director: { id: 101, name: 'Denis Villeneuve', job: 'Director' },
    writers: [{ id: 102, name: 'Jon Spaihts', job: 'Screenplay' }],
    cast: [
      { id: 201, name: 'Timothée Chalamet', character: 'Paul Atreides', profilePath: 'https://image.tmdb.org/t/p/w500/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: 202, name: 'Zendaya', character: 'Chani', profilePath: 'https://image.tmdb.org/t/p/w500/r3A7ev7QkjVSrm4JFi0HaIqd9VO.jpg' },
      { id: 203, name: 'Rebecca Ferguson', character: 'Lady Jessica', profilePath: 'https://image.tmdb.org/t/p/w500/6NRiipbNqK9i7HkS9LzO2gVb6w4.jpg' },
      { id: 204, name: 'Javier Bardem', character: 'Stilgar', profilePath: 'https://image.tmdb.org/t/p/w500/gK7eP6X85G3qgYqY7b43xP7Uf7j.jpg' },
    ],
    crew: [
      { id: 101, name: 'Denis Villeneuve', job: 'Director' },
      { id: 301, name: 'Greig Fraser', job: 'Director of Photography' },
      { id: 302, name: 'Hans Zimmer', job: 'Original Music Composer' },
    ],
    budget: 190000000,
    revenue: 711800000,
    status: 'Released',
    originalLanguage: 'EN',
    spokenLanguages: ['English'],
    productionCompanies: [
      { id: 923, name: 'Legendary Pictures', logoPath: null, originCountry: 'US' },
      { id: 174, name: 'Warner Bros. Pictures', logoPath: null, originCountry: 'US' },
    ],
    productionCountries: ['United States of America'],
    homepage: null,
    adult: false,
    collection: null,
    keywords: ['epic', 'desert', 'destiny', 'space opera'],
    trailerYoutubeId: 'Way9Dexny3w',
    videos: [
      {
        id: 'Way9Dexny3w',
        key: 'Way9Dexny3w',
        name: 'Official Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
    ],
    screenshots: [backdropPath, posterPath],
    galleryImages: {
      backdrops: [backdropPath],
      posters: [posterPath],
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Film Enthusiast',
        avatarPath: null,
        rating: 9,
        createdAt: '2024-03-01',
        content: 'A breathtaking cinematic achievement and masterclass in storytelling.',
      },
    ],
    imdbId: `tt${found.id}`,
    accentColor: 'rgba(229, 9, 20, 0.4)',
    similarMovies,
    recommendations: similarMovies,
  };
};

