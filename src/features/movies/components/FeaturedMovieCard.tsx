import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check } from 'lucide-react';
import type { Movie } from '@/types/tmdb';
import { RatingBadge } from '@/components/ui/Badges';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface FeaturedMovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onWatchlistToggle: () => void;
  className?: string;
}

export const FeaturedMovieCard: React.FC<FeaturedMovieCardProps> = ({
  movie,
  isInWatchlist,
  onWatchlistToggle,
  className,
}) => {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className={cn(
      "relative w-full rounded-3xl overflow-hidden bg-black aspect-[21/9] min-h-[350px] shadow-premium select-none border border-border group",
      className
    )}>
      <div className="absolute inset-0 bg-black/30 z-0">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000 ease-out"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent z-10" />

      <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <RatingBadge rating={movie.vote_average} />
          <span className="text-sm font-semibold text-text-secondary">
            {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
          </span>
          <span className="h-1 w-1 bg-border rounded-full" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded border border-border text-text-secondary select-none">
            PG-13
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-3 leading-tight tracking-tight">
          {movie.title}
        </h1>

        <p className="text-sm sm:text-base text-text-secondary line-clamp-3 mb-6 leading-relaxed">
          {movie.overview}
        </p>

        <div className="flex flex-wrap gap-3.5">
          <Button
            variant="primary"
            leftIcon={<Play className="h-4.5 w-4.5 fill-white" />}
            className="glow-red text-white"
            onClick={() => {}}
          >
            Play Trailer
          </Button>

          <Button
            variant="secondary"
            leftIcon={isInWatchlist ? <Check className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
            onClick={onWatchlistToggle}
          >
            {isInWatchlist ? 'Watchlisted' : 'Add Watchlist'}
          </Button>

          <Link to={`/movie/${movie.id}`}>
            <Button variant="outline" leftIcon={<Info className="h-4.5 w-4.5" />}>
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovieCard;
