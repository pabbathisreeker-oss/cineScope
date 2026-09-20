import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    genre,
    with_genres,
    year,
    primary_release_year,
    minRating,
    'vote_average.gte': voteAverageGte,
    sortBy,
    sort_by,
    page = '1',
    language,
    with_original_language,
  } = req.query;

  const actualSortBy = sortBy || sort_by || 'popularity.desc';
  const actualGenre = genre || with_genres;
  const actualYear = year || primary_release_year;
  const actualLanguage = language || with_original_language;
  const actualMinRating = minRating || voteAverageGte;

  const params: Record<string, string | number | boolean> = {
    page: String(page),
    include_adult: false,
    sort_by: String(actualSortBy),
  };

  if (actualGenre && actualGenre !== 'all') {
    params.with_genres = String(actualGenre);
  }
  if (actualYear && actualYear !== 'all') {
    params.primary_release_year = String(actualYear);
  }
  if (actualLanguage && actualLanguage !== 'all') {
    params.with_original_language = String(actualLanguage);
  }
  if (actualMinRating && Number(actualMinRating) > 0) {
    params['vote_average.gte'] = Number(actualMinRating);
    params['vote_count.gte'] = 50;
  }

  try {
    const data = await fetchFromTMDB('/discover/movie', { params });

    res.setHeader('Cache-Control', 'public, s-maxage=14400, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error discovering movies:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to discover movies',
    });
  }
}

