import { Agent } from 'undici';
import dns from 'node:dns';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBFetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

// Public DNS resolver to bypass ISP DNS blackholing / poisoning
// In regions where ISPs (such as Jio/Airtel) return blackhole IPs for api.themoviedb.org,
// resolving via Google (8.8.8.8) / Cloudflare (1.1.1.1) yields the genuine AWS CloudFront IPs.
const resolver = new dns.promises.Resolver();
try {
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use default system resolver if setServers fails
}

function customLookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: (err: NodeJS.ErrnoException | null, address: any, family?: number) => void
) {
  const cb = typeof options === 'function' ? options : callback;
  const all = typeof options === 'object' && options !== null && 'all' in options && options.all;

  if (hostname.includes('themoviedb.org')) {
    resolver
      .resolve4(hostname)
      .then((ips) => {
        if (ips && ips.length > 0) {
          if (all) {
            return cb(null, ips.map((ip) => ({ address: ip, family: 4 })));
          }
          return cb(null, ips[0], 4);
        }
        dns.lookup(hostname, options, cb);
      })
      .catch(() => {
        // Graceful fallback to OS resolver if custom DNS resolution fails
        dns.lookup(hostname, options, cb);
      });
  } else {
    dns.lookup(hostname, options, cb);
  }
}

// Reusable Undici Agent configured with our resilient lookup
const tmdbAgent = new Agent({
  connect: {
    lookup: customLookup,
  },
});

export async function fetchFromTMDB<T = unknown>(
  endpoint: string,
  options: TMDBFetchOptions = {}
): Promise<T> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error('TMDB_READ_ACCESS_TOKEN is missing on the server.');
  }

  const url = new URL(
    `${TMDB_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  );

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    dispatcher: tmdbAgent,
  } as RequestInit);

  if (!response.ok) {
    let statusText = response.statusText;

    try {
      const errorBody = await response.json();

      if (errorBody?.status_message) {
        statusText = errorBody.status_message;
      }
    } catch {
      // Ignore invalid error responses
    }

    throw new Error(
      `TMDB API request failed [${response.status}]: ${statusText}`
    );
  }

  return (await response.json()) as T;
}
