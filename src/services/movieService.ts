import movieApi from '@/api/movieApi';
import { isMockMode } from '@/api/tmdb';
import type { Movie, Genre } from '@/types/tmdb';
import type { DetailedMovieData, CastMember, CrewMember, MovieVideo, WatchProvidersData, WatchProviderItem, MovieReview } from '@/features/movies/data/mockMovieDetails';
import { getMovieDetailsById } from '@/features/movies/data/mockMovieDetails';
import { MOCK_MOVIES, GENRE_MAP } from '@/features/movies/data/mockMovies';

/**
 * Movie Service - Handles live TMDB API requests with clean fallback handling
 */
export const movieService = {
  /**
   * Fetch Trending Movies (day or week)
   */
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<Movie[]> {
    if (isMockMode()) {
      return MOCK_MOVIES;
    }
    try {
      const results = await movieApi.getTrendingMovies(timeWindow);
      return results && results.length > 0 ? results : MOCK_MOVIES;
    } catch (error) {
      console.warn('TMDB API Error in getTrendingMovies, falling back to mock data:', error);
      return MOCK_MOVIES;
    }
  },

  /**
   * Fetch Popular Movies
   */
  async getPopularMovies(page: number = 1): Promise<Movie[]> {
    if (isMockMode()) {
      return MOCK_MOVIES;
    }
    try {
      const results = await movieApi.getPopularMovies(page);
      return results && results.length > 0 ? results : MOCK_MOVIES;
    } catch (error) {
      console.warn('TMDB API Error in getPopularMovies, falling back to mock data:', error);
      return MOCK_MOVIES;
    }
  },

  /**
   * Fetch Top Rated Movies
   */
  async getTopRatedMovies(page: number = 1): Promise<Movie[]> {
    if (isMockMode()) {
      return [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    }
    try {
      const results = await movieApi.getTopRatedMovies(page);
      return results && results.length > 0 ? results : [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    } catch (error) {
      console.warn('TMDB API Error in getTopRatedMovies, falling back to mock data:', error);
      return [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    }
  },

  /**
   * Fetch Now Playing / Recent Movies
   */
  async getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
    if (isMockMode()) {
      return MOCK_MOVIES;
    }
    try {
      const results = await movieApi.getNowPlayingMovies(page);
      return results && results.length > 0 ? results : MOCK_MOVIES;
    } catch (error) {
      console.warn('TMDB API Error in getNowPlayingMovies, falling back to mock data:', error);
      return MOCK_MOVIES;
    }
  },


  /**
   * Fetch Detailed Movie Info by ID
   */
  async getMovieDetails(id: string | number): Promise<DetailedMovieData | null> {
    if (isMockMode()) {
      return getMovieDetailsById(id);
    }
    try {
      const movieData = await movieApi.getMovieDetails(id);

      if (!movieData || !movieData.id) {
        return getMovieDetailsById(id);
      }

      const creditsData = movieData.credits || null;
      const videosData = movieData.videos || null;
      const recommendationsData = movieData.recommendations || null;
      const keywordsData = movieData.keywords || null;
      const imagesData = movieData.images || null;
      const releaseDatesData = movieData.release_dates || null;
      const similarData = movieData.similar || null;
      const providersData = movieData['watch/providers'] || null;
      const reviewsData = movieData.reviews || null;

      // Extract YouTube videos
      const videos: MovieVideo[] = (videosData?.results || [])
        .filter((v: { site: string }) => v.site === 'YouTube')
        .map((v: { id: string; key: string; name: string; site: string; type: string; official?: boolean; published_at?: string }) => ({
          id: v.id || v.key,
          key: v.key,
          name: v.name,
          site: v.site,
          type: v.type,
          official: Boolean(v.official),
          publishedAt: v.published_at,
        }));

      // Select primary trailer using priority algorithm:
      // 1. Official Trailer -> 2. Trailer -> 3. Teaser -> 4. Clip -> 5. Featurette -> 6. First available
      const primaryTrailer =
        videos.find((v) => v.official && v.type === 'Trailer') ||
        videos.find((v) => v.type === 'Trailer') ||
        videos.find((v) => v.type === 'Teaser') ||
        videos.find((v) => v.type === 'Clip') ||
        videos.find((v) => v.type === 'Featurette') ||
        videos[0];

      const trailerYoutubeId = primaryTrailer?.key || '';

      // Extract crew & cast accurately from credits data
      const crewList: { id: number; name: string; job: string }[] = creditsData?.crew || [];
      const castList: { id: number; name: string; character: string; profile_path: string | null }[] = creditsData?.cast || [];

      // 1. Director
      const directors = crewList.filter((c) => c.job === 'Director');
      const directorObj = directors[0];
      const director: CrewMember = directorObj
        ? { id: directorObj.id, name: directorObj.name, job: 'Director' }
        : { id: 0, name: directors.map((d) => d.name).join(', ') || 'Unknown', job: 'Director' };

      // 2. Writers (Screenplay, Writer, Story, Author)
      const writerJobs = ['Screenplay', 'Writer', 'Story', 'Original Story', 'Author'];
      const writerObjs = crewList.filter((c) => writerJobs.includes(c.job));
      const writers: CrewMember[] = writerObjs.length > 0
        ? writerObjs.map((w) => ({ id: w.id, name: w.name, job: w.job }))
        : (directorObj ? [{ id: directorObj.id, name: directorObj.name, job: 'Screenplay' }] : []);

      // 3. Cast (using TMDB w500 image base URL per requirements)
      const cast: CastMember[] = castList.map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character || 'Role',
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w500${c.profile_path}` : null,
      }));

      // 4. Crew
      const crew: CrewMember[] = crewList.map((c) => ({
        id: c.id,
        name: c.name,
        job: c.job,
      }));

      // Extract US certification / rating (e.g. PG-13, R)
      let certification = '';
      if (releaseDatesData?.results) {
        const usRelease = releaseDatesData.results.find((r: { iso_3166_1: string }) => r.iso_3166_1 === 'US');
        if (usRelease?.release_dates) {
          const certObj = usRelease.release_dates.find((d: { certification: string }) => d.certification);
          certification = certObj?.certification || '';
        }
      }

      // Extract collection info if present
      const collection = movieData.belongs_to_collection
        ? {
            id: movieData.belongs_to_collection.id,
            name: movieData.belongs_to_collection.name,
            posterPath: movieData.belongs_to_collection.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieData.belongs_to_collection.poster_path}`
              : null,
            backdropPath: movieData.belongs_to_collection.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movieData.belongs_to_collection.backdrop_path}`
              : null,
          }
        : null;

      // Extract keywords
      const keywords: string[] = (keywordsData?.keywords || keywordsData?.results || []).map((k: { name: string }) => k.name).slice(0, 12);

      // Extract images from TMDB Images API (prefer w780 or original backdrops, up to 10 images)
      const rawBackdrops: string[] = (imagesData?.backdrops || []).map((img: { file_path: string }) => `https://image.tmdb.org/t/p/w780${img.file_path}`);
      const rawLogos: string[] = (imagesData?.logos || []).map((img: { file_path: string }) => `https://image.tmdb.org/t/p/w500${img.file_path}`);
      const rawPosters: string[] = (imagesData?.posters || []).map((img: { file_path: string }) => `https://image.tmdb.org/t/p/w780${img.file_path}`);

      // Combine priority: Backdrops -> Logos -> Posters (up to 10)
      const backdrops: string[] = rawBackdrops.slice(0, 10);
      const posters: string[] = rawPosters.slice(0, 10);

      let combinedGallery: string[] = [...rawBackdrops, ...rawLogos, ...rawPosters].slice(0, 10);
      if (combinedGallery.length === 0 && (movieData.backdrop_path || movieData.poster_path)) {
        if (movieData.backdrop_path) combinedGallery.push(`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`);
        if (movieData.poster_path) combinedGallery.push(`https://image.tmdb.org/t/p/w780${movieData.poster_path}`);
      }

      // Extract recommendations
      const recommendations: Movie[] = (recommendationsData?.results || []).slice(0, 6);

      const releaseYear = movieData.release_date ? new Date(movieData.release_date).getFullYear() : 2024;
      const posterPath = movieData.poster_path
        ? (movieData.poster_path.startsWith('http') ? movieData.poster_path : `https://image.tmdb.org/t/p/w500${movieData.poster_path}`)
        : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
      const backdropPath = movieData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
        : posterPath;

      // Extract Similar Movies (up to 10)
      const similarMovies: Movie[] = (similarData?.results || []).slice(0, 10);

      // Extract Watch Providers
      let watchProviders: WatchProvidersData | null = null;
      if (providersData?.results) {
        const results = providersData.results;
        const countryCode = results.IN ? 'IN' : results.US ? 'US' : Object.keys(results)[0];
        const countryObj = countryCode ? results[countryCode] : null;

        if (countryObj) {
          const mapProviders = (items?: any[]): WatchProviderItem[] =>
            (items || []).map((p) => ({
              id: p.provider_id,
              name: p.provider_name,
              logoPath: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
            }));

          watchProviders = {
            countryCode: countryCode || 'IN',
            link: countryObj.link,
            flatrate: mapProviders(countryObj.flatrate),
            rent: mapProviders(countryObj.rent),
            buy: mapProviders(countryObj.buy),
          };
        }
      }

      // Extract Reviews
      const reviews: MovieReview[] = (reviewsData?.results || []).map((r: any) => {
        let avatarPath = r.author_details?.avatar_path;
        if (avatarPath) {
          if (avatarPath.startsWith('/http')) {
            avatarPath = avatarPath.substring(1);
          } else if (!avatarPath.startsWith('http')) {
            avatarPath = `https://image.tmdb.org/t/p/w185${avatarPath}`;
          }
        } else {
          avatarPath = null;
        }

        return {
          id: r.id,
          author: r.author_details?.name || r.author || 'Anonymous Critic',
          avatarPath,
          rating: r.author_details?.rating || null,
          createdAt: r.created_at ? r.created_at.split('T')[0] : 'Recently',
          content: r.content,
          url: r.url,
        };
      });

      return {
        id: movieData.id,
        title: movieData.title,
        originalTitle: movieData.original_title !== movieData.title ? movieData.original_title : undefined,
        tagline: movieData.tagline || null,
        overview: movieData.overview,
        backdropPath,
        posterPath,
        voteAverage: movieData.vote_average,
        voteCount: movieData.vote_count,
        popularity: Math.round(movieData.popularity * 10) / 10,
        releaseYear,
        releaseDate: movieData.release_date || '2024-01-01',
        runtime: movieData.runtime || 120,
        certification: certification || undefined,
        genres: movieData.genres || [],
        director,
        writers: writers.length > 0 ? writers : [{ id: 2, name: director.name, job: 'Screenplay' }],
        cast,
        crew,
        budget: movieData.budget || 0,
        revenue: movieData.revenue || 0,
        status: movieData.status || 'Released',
        originalLanguage: (movieData.original_language || 'en').toUpperCase(),
        spokenLanguages: movieData.spoken_languages?.map((l: { english_name: string }) => l.english_name) || [],
        productionCompanies: movieData.production_companies?.map((c: { id: number; name: string; logo_path: string; origin_country: string }) => ({
          id: c.id,
          name: c.name,
          logoPath: c.logo_path ? `https://image.tmdb.org/t/p/w185${c.logo_path}` : null,
          originCountry: c.origin_country || '',
        })) || [],
        productionCountries: movieData.production_countries?.map((c: { name: string }) => c.name) || [],
        homepage: movieData.homepage || null,
        adult: movieData.adult || false,
        collection,
        keywords,
        trailerYoutubeId,
        videos,
        screenshots: combinedGallery,
        galleryImages: {
          backdrops: backdrops.length > 0 ? backdrops : combinedGallery,
          posters: posters.length > 0 ? posters : [posterPath],
        },
        watchProviders,
        reviews: reviews.length > 0 ? reviews : undefined,
        imdbId: movieData.imdb_id || `tt${movieData.id}`,
        accentColor: 'rgba(229, 9, 20, 0.4)',
        similarMovies,
        recommendations,
      };
    } catch (error) {
      console.warn(`TMDB API Error fetching movie detail for ID ${id}:`, error);
      return getMovieDetailsById(id);
    }
  },

  /**
   * Search Movies by text query
   */
  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    if (!query.trim()) return [];
    const filterMockSearch = () => {
      const lower = query.toLowerCase();
      return MOCK_MOVIES.filter(
        (m) => m.title.toLowerCase().includes(lower) || m.overview.toLowerCase().includes(lower)
      );
    };

    if (isMockMode()) {
      return filterMockSearch();
    }
    try {
      const results = await movieApi.searchMovies(query, page);
      return Array.isArray(results) ? results : filterMockSearch();
    } catch (error) {
      console.warn('TMDB API Error in searchMovies, falling back to mock search:', error);
      return filterMockSearch();
    }
  },

  /**
   * Discover Movies with advanced filters (Genre, Year, Language, Rating, Sort)
   */
  async discoverMovies(params: {
    genre?: string;
    year?: string;
    language?: string;
    rating?: number;
    sortBy?: string;
    page?: number;
  } = {}): Promise<Movie[]> {
    const page = params.page || 1;
    const filterMockDiscover = () => {
      let filtered = [...MOCK_MOVIES];
      if (params.genre && params.genre !== 'all') {
        const gid = parseInt(params.genre, 10);
        filtered = filtered.filter((m) => m.genre_ids?.includes(gid));
      }
      if (params.year && params.year !== 'all') {
        filtered = filtered.filter((m) => m.release_date.startsWith(params.year!));
      }
      if (params.language && params.language !== 'all') {
        filtered = filtered.filter((m) => m.original_language === params.language);
      }
      if (params.rating && params.rating > 0) {
        filtered = filtered.filter((m) => m.vote_average >= params.rating!);
      }
      if (params.sortBy) {
        if (params.sortBy === 'vote_average.desc') {
          filtered.sort((a, b) => b.vote_average - a.vote_average);
        } else if (params.sortBy === 'primary_release_date.desc') {
          filtered.sort((a, b) => b.release_date.localeCompare(a.release_date));
        } else if (params.sortBy === 'primary_release_date.asc') {
          filtered.sort((a, b) => a.release_date.localeCompare(b.release_date));
        } else {
          filtered.sort((a, b) => b.popularity - a.popularity);
        }
      }
      return filtered;
    };

    if (isMockMode()) {
      return filterMockDiscover();
    }
    try {
      const apiParams: Record<string, any> = {
        page,
        sortBy: params.sortBy || 'popularity.desc',
      };

      if (params.genre && params.genre !== 'all') {
        apiParams.genre = params.genre;
      }
      if (params.year && params.year !== 'all') {
        apiParams.year = params.year;
      }
      if (params.language && params.language !== 'all') {
        apiParams.language = params.language;
      }
      if (params.rating && params.rating > 0) {
        apiParams.minRating = params.rating;
      }

      const results = await movieApi.discoverMovies(apiParams);
      return Array.isArray(results) ? results : filterMockDiscover();
    } catch (error) {
      console.warn('TMDB API Error in discoverMovies, falling back to mock data:', error);
      return filterMockDiscover();
    }
  },

  /**
   * Fetch Movie Genres List
   */
  async getMovieGenres(): Promise<Genre[]> {
    const mockGenres: Genre[] = Object.entries(GENRE_MAP).map(([id, name]) => ({
      id: Number(id),
      name,
    }));

    if (isMockMode()) {
      return mockGenres;
    }
    try {
      const results = await movieApi.getGenres();
      return results && results.length > 0 ? results : mockGenres;
    } catch (error) {
      console.warn('TMDB API Error in getMovieGenres, falling back to mock genres:', error);
      return mockGenres;
    }
  },
};

export default movieService;

