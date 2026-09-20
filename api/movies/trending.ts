import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { timeWindow = 'day' } = req.query;
  const validWindow = timeWindow === 'week' ? 'week' : 'day';

  try {
    const data = await fetchFromTMDB(`/trending/movie/${validWindow}`);
    
    // Shorter TTL for trending content (1 hour edge cache, 24 hours SWR)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error fetching trending movies:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to fetch trending movies',
    });
  }
}

