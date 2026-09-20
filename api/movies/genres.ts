import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchFromTMDB('/genre/movie/list');

    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=2592000');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error fetching movie genres:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to fetch movie genres',
    });
  }
}

