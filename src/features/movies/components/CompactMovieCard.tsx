import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import type { Movie } from '@/types/tmdb';
import { cn } from '@/lib/utils';

interface CompactMovieCardProps {
  movie: Movie;
  onRemove?: (e: React.MouseEvent) => void;
  className?: string;
}

export const CompactMovieCard: React.FC<CompactMovieCardProps> = ({
  movie,
  onRemove,
  className,
}) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=150&auto=format&fit=crop';

  return (
    <div className={cn(
      "relative flex items-center bg-surface border border-border rounded-xl p-2 select-none gap-3 hover:bg-surface-hover transition-colors duration-250 group",
      className
    )}>
      <Link to={`/movie/${movie.id}`} className="absolute inset-0 z-10" />

      <div className="h-16 w-11 flex-shrink-0 overflow-hidden rounded-md bg-black/20">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-grow min-w-0 pr-6">
        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-0.5 tracking-tight">
          {movie.title}
        </h4>
        <div className="flex items-center space-x-2.5 text-xs text-muted-foreground">
          <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
          <span className="h-1 w-1 bg-border rounded-full" />
          <div className="flex items-center text-[#F5C518] gap-0.5 font-semibold">
            <Star className="h-3 w-3 fill-[#F5C518]" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CompactMovieCard;

