import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * Vite plugin that mounts the actual Vercel serverless functions in api/movies/*.ts
 * during local development, ensuring full parity with Vercel Serverless runtime.
 */
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/movies')) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url, 'http://localhost');
          const pathname = parsedUrl.pathname;
          const queryParams: Record<string, string> = {};
          parsedUrl.searchParams.forEach((val, key) => {
            queryParams[key] = val;
          });

          // Map endpoint to serverless function
          let handlerFile: string | null = null;
          const query = { ...queryParams };

          if (pathname === '/api/movies/trending') {
            handlerFile = path.resolve(__dirname, 'api/movies/trending.ts');
          } else if (pathname === '/api/movies/popular') {
            handlerFile = path.resolve(__dirname, 'api/movies/popular.ts');
          } else if (pathname === '/api/movies/top-rated') {
            handlerFile = path.resolve(__dirname, 'api/movies/top-rated.ts');
          } else if (pathname === '/api/movies/now-playing') {
            handlerFile = path.resolve(__dirname, 'api/movies/now-playing.ts');
          } else if (pathname === '/api/movies/upcoming') {
            handlerFile = path.resolve(__dirname, 'api/movies/upcoming.ts');
          } else if (pathname === '/api/movies/discover') {
            handlerFile = path.resolve(__dirname, 'api/movies/discover.ts');
          } else if (pathname === '/api/movies/search') {
            handlerFile = path.resolve(__dirname, 'api/movies/search.ts');
          } else if (pathname === '/api/movies/genres') {
            handlerFile = path.resolve(__dirname, 'api/movies/genres.ts');
          } else {
            const match = pathname.match(/^\/api\/movies\/([^/]+)$/);
            if (match) {
              handlerFile = path.resolve(__dirname, 'api/movies/[id].ts');
              query.id = match[1];
            }
          }

          if (!handlerFile) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }

          // Dynamically load and execute the serverless function handler
          const mod = await server.ssrLoadModule(handlerFile);
          const handler = mod.default;

          req.query = query;
          res.status = function (statusCode: number) {
            res.statusCode = statusCode;
            return this;
          };
          res.json = function (data: any) {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json');
            }
            return res.end(JSON.stringify(data));
          };

          await handler(req, res);
        } catch (err: any) {
          console.error('[API Server Error]:', err?.message || err);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to fetch movie data' }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side environment variables into process.env
  const env = loadEnv(mode, process.cwd(), '');
  if (env.TMDB_READ_ACCESS_TOKEN) {
    process.env.TMDB_READ_ACCESS_TOKEN = env.TMDB_READ_ACCESS_TOKEN;
  }

  return {
    plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
