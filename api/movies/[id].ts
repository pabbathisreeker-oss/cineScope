import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromTMDB } from '../_lib/tmdb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Movie ID is required' });
  }

  try {
    const data = await fetchFromTMDB(`/movie/${id}`, {
      params: {
        append_to_response: 'credits,videos,recommendations,similar,keywords,images,release_dates,watch/providers,reviews',
      },
    });

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error(`Error fetching movie details for ID ${id}:`, error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'Failed to fetch movie details',
    });
  }
}

