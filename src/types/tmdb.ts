export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  runtime: number | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
