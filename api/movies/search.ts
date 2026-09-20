import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, query, page = '1' } = req.query;
  const searchQuery = String(q || query || '').trim();

  if (!searchQuery) {
    return res.status(200).json({ page: 1, results: [], total_pages: 0, total_results: 0 });
  }

  try {
    const data = await fetchFromTMDB('/search/movie', {
      params: {
        query: searchQuery,
        page: String(page),
        include_adult: false,
      },
    });

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error searching movies:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to search movies',
    });
  }
}

