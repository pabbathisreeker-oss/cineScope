import type { Movie } from '@/types/tmdb';

// Helper types for Hero component
export interface HeroMovieData {
  id: number | string;
  title: string;
  tagline?: string;
  overview: string;
  backdropPath: string;
  posterPath: string;
  voteAverage: number;
  releaseYear: string | number;
  runtime?: number;
  genres: string[];
  trailerUrl?: string;
}

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const getGenreNames = (genreIds: number[]): string[] =>
  genreIds.map((id) => GENRE_MAP[id]).filter(Boolean);

export const MOCK_MOVIES: Movie[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview:
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
    release_date: '2024-02-27',
    vote_average: 8.3,
    vote_count: 5120,
    popularity: 420.5,
    genre_ids: [878, 12],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 157336,
    title: 'Interstellar',
    original_title: 'Interstellar',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTsqJJR0KP8UN8vCnZlhJW2B.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 34500,
    popularity: 280.1,
    genre_ids: [12, 18, 878],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview:
      'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, exploring the deep moral dilemmas and political fallout that followed.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 8900,
    popularity: 310.8,
    genre_ids: [18, 36],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 27205,
    title: 'Inception',
    original_title: 'Inception',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 36200,
    popularity: 220.4,
    genre_ids: [28, 878, 12],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 155,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 32000,
    popularity: 250.6,
    genre_ids: [18, 28, 80, 53],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 335984,
    title: 'Blade Runner 2049',
    original_title: 'Blade Runner 2049',
    overview:
      'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.',
    poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: '/ilRyAZw2JuM8ZcM8otqLql42U1C.jpg',
    release_date: '2017-10-04',
    vote_average: 7.9,
    vote_count: 13200,
    popularity: 180.2,
    genre_ids: [878, 18],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    original_title: 'Spider-Man: Across the Spider-Verse',
    overview:
      'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider-Society, a team of Spider-People charged with protecting the Multiverse’s very existence.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 6700,
    popularity: 290.7,
    genre_ids: [16, 28, 12, 878],
    adult: false,
    video: false,
    original_language: 'en',
  },
  {
    id: 414906,
    title: 'The Batman',
    original_title: 'The Batman',
    overview:
      'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop_path: '/5P8SmMzSNYikXpxil6BYzJ16611.jpg',
    release_date: '2022-03-01',
    vote_average: 7.7,
    vote_count: 9800,
    popularity: 195.4,
    genre_ids: [80, 9648, 53],
    adult: false,
    video: false,
    original_language: 'en',
  },
];
