import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';
import MovieDetailsView from '@/features/movies/components/MovieDetailsView';
import useMovieDetails from '@/hooks/useMovieDetails';
import Button from '@/components/ui/Button';
import PATHS from '@/routes/paths';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, isError } = useMovieDetails(id);

  // Scroll to top whenever ID parameter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handlePlayTrailer = () => {
    if (movie?.trailerYoutubeId) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`, '_blank');
    }
  };

  // Movie Not Found Fallback State
  if (!isLoading && (isError || !movie)) {
    return (
      <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-20 select-none">
        <div className="max-w-md w-full text-center flex flex-col items-center p-8 rounded-3xl glass-panel border border-white/10 shadow-premium">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-5">
            <Film className="h-10 w-10" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-white mb-2">
            Movie Profile Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed">
            We couldn't locate a film matching ID <code className="text-primary font-mono bg-white/5 px-2 py-0.5 rounded">#{id}</code> in our database.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Link to={PATHS.HOME} className="w-full sm:w-auto">
              <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />} fullWidth>
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MovieDetailsView
      movie={movie || null}
      isLoading={isLoading}
      onPlayTrailer={handlePlayTrailer}
    />
  );
};

export default MovieDetailPage;
