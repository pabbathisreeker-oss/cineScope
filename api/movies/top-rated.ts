import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { page = '1' } = req.query;

  try {
    const data = await fetchFromTMDB('/movie/top_rated', {
      params: { page: String(page) },
    });

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error fetching top-rated movies:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to fetch top-rated movies',
    });
  }
}

