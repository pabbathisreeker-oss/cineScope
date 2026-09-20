import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Movie } from '@/types/tmdb';
import { RatingBadge } from '@/components/ui/Badges';
import FavoriteButton from './FavoriteButton';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite = false,
  onFavoriteToggle = () => {},
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      onClick={handleCardClick}
      className="relative group rounded-2xl overflow-hidden bg-surface/50 border border-white/[0.07] hover:border-primary/45 shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.95),0_0_22px_rgba(212,161,90,0.15)] flex flex-col cursor-pointer select-none transition-all duration-300"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#030B1B]">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-surface/80 rounded-t-2xl" />
        )}
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-106 group-hover:brightness-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hover Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030B1B]/95 via-[#030B1B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10 backdrop-blur-[2px]">
          <div className="flex items-start justify-between">
            <RatingBadge rating={movie.vote_average} size="sm" />
            <FavoriteButton isFavorite={isFavorite} onClick={onFavoriteToggle} size="sm" />
          </div>

          <div
            className="self-center p-3 rounded-full bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-primary-foreground shadow-[0_0_24px_rgba(212,161,90,0.6)] transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:brightness-110 hover:scale-110 active:scale-95"
            aria-label={`View ${movie.title}`}
          >
            <Play className="h-4 w-4 fill-current ml-0.5" />
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {movie.overview && (
              <p className="text-[10px] text-foreground/80 line-clamp-2 mb-1 leading-snug">{movie.overview}</p>
            )}
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">{releaseYear}</span>
          </div>
        </div>
      </div>

      {/* Persistent Info Below Poster */}
      <div className="px-3.5 py-3 bg-surface/75 border-t border-white/[0.05] group-hover:bg-surface/95 transition-colors duration-300">
        <h3 className="text-xs sm:text-[13px] font-bold text-foreground line-clamp-1 leading-snug group-hover:text-primary transition-colors tracking-tight">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] font-medium text-muted-foreground">{releaseYear}</span>
          {movie.vote_average > 0 && (
            <span className="text-[10px] font-bold text-primary flex items-center space-x-0.5">
              <span>★</span>
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;

