import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Play, Share2, Check, Flame, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { RatingBadge, RuntimeBadge, GenreChip } from '@/components/ui/Badges';
import type { DetailedMovieData } from '@/features/movies/data/mockMovieDetails';
import useWatchlistStore from '@/features/watchlist/store/useWatchlistStore';
import { Skeleton } from '@/components/ui/Feedback';
import FavoriteButton from './FavoriteButton';
import WatchlistButton from './WatchlistButton';
import {
  OverviewSection,
  StatisticsSection,
  ImageGallerySection,
  MovieFactsSection,
  ProductionSection,
  CollectionSection,
  KeywordsSection,
  RecommendationsSection,
} from './MovieDetailsSections';
import { CastSection, CrewSection } from './CastCrewSection';
import VideosSection from './VideosSection';
import SimilarMoviesSection from './SimilarMoviesSection';
import WatchProvidersSection from './WatchProvidersSection';
import ReviewsSection from './ReviewsSection';

interface MovieDetailsViewProps {
  movie: DetailedMovieData | null;
  isLoading?: boolean;
  onPlayTrailer?: () => void;
  onShare?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
  movie,
  isLoading = false,
  onPlayTrailer,
  onShare,
}) => {
  const { items, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const [copied, setCopied] = useState(false);

  // Loading Skeleton Screen
  if (isLoading || !movie) {
    return (
      <div className="relative w-full flex flex-col min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 select-none">
        <div className="w-full min-h-[60vh] rounded-3xl bg-zinc-900/60 animate-pulse p-6 sm:p-10 flex flex-col lg:flex-row items-end gap-8">
          <Skeleton className="w-48 sm:w-64 aspect-[2/3] rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-10 sm:h-14 w-3/4 rounded" />
            <div className="flex space-x-3">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
            <Skeleton className="h-16 w-full rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const isBookmarked = items.some((item) => String(item.movie.id) === String(movie.id));
  const currentItem = items.find((item) => String(item.movie.id) === String(movie.id));
  const isFavorite = Boolean(currentItem?.isFavorite);

  const movieObj = {
    id: movie.id,
    title: movie.title,
    original_title: movie.originalTitle || movie.title,
    overview: movie.overview,
    poster_path: movie.posterPath,
    backdrop_path: movie.backdropPath,
    release_date: String(movie.releaseYear),
    vote_average: movie.voteAverage,
    vote_count: movie.voteCount,
    popularity: movie.popularity || 100,
    genre_ids: (movie.genres || []).map((g) => g.id),
    adult: movie.adult || false,
    video: false,
    original_language: (movie.originalLanguage || 'EN').toLowerCase(),
  };

  const handleWatchlistToggle = () => {
    if (isBookmarked) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movieObj);
    }
  };

  const handleFavoriteToggle = () => {
    const { addToFavorites, removeFromFavorites } = useWatchlistStore.getState();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movieObj);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full flex flex-col min-h-screen select-none pb-24 md:pb-16"
    >
      {/* Dynamic Theme Accent Ambient Radial Glow */}
      <div
        className="absolute top-0 left-0 w-full h-[650px] pointer-events-none z-0 transition-colors duration-700 opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${movie.accentColor || 'rgba(212, 161, 90, 0.2)'} 0%, transparent 70%)`,
        }}
      />

      {/* 1. CINEMATIC HERO SPOTLIGHT */}
      <div className="relative w-full min-h-[75vh] lg:min-h-[85vh] flex items-end overflow-hidden pt-20">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={movie.backdropPath}
            alt={movie.title}
            loading="eager"
            className="w-full h-full object-cover opacity-45 scale-105 filter blur-[0.5px]"
          />
          {/* Layered Gradients for seamless contrast & atmospheric blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background/90 via-background/40 to-transparent z-10" />
          <div className="absolute inset-0 z-10 pointer-events-none cinematic-vignette" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-16 flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-14">
          
          {/* Floating Movie Poster */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="flex-shrink-0 w-48 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95)] p-[1.5px] bg-gradient-to-b from-white/25 via-primary/30 to-white/10 hover:from-primary/70 hover:via-accent/40 hover:to-primary/70 transition-all duration-500 relative group cursor-pointer"
          >
            <div className="w-full h-full rounded-[15px] overflow-hidden relative">
              <img
                src={movie.posterPath}
                alt={movie.title}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                  HD Quality • CineScope Profile
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero Details */}
          <div className="flex-1 flex flex-col text-center lg:text-left items-center lg:items-start">
            {movie.tagline && (
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm font-bold tracking-[0.25em] text-primary uppercase mb-2 font-display drop-shadow-sm"
              >
                "{movie.tagline}"
              </motion.p>
            )}

            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md"
            >
              {movie.title}
            </motion.h1>

            {/* Original Title (only if different) */}
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <motion.p variants={itemVariants} className="text-xs sm:text-sm text-text-muted italic mb-3">
                Original Title: {movie.originalTitle}
              </motion.p>
            )}

            {/* Badges & Meta Metadata Row */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-5">
              <RatingBadge rating={movie.voteAverage} size="md" />

              {movie.voteCount && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-surface/60 text-text-secondary flex items-center space-x-1">
                  <Users className="h-3 w-3 text-accent" />
                  <span>{movie.voteCount.toLocaleString()} votes</span>
                </span>
              )}

              {movie.certification && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-md border border-rating-star/40 bg-rating-star/10 text-rating-star">
                  {movie.certification}
                </span>
              )}

              <span className="text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-surface/60 backdrop-blur-md text-text-primary">
                {movie.releaseYear}
              </span>

              {movie.runtime && movie.runtime > 0 && <RuntimeBadge minutes={movie.runtime} />}

              {movie.popularity && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-surface/60 text-primary flex items-center space-x-1">
                  <Flame className="h-3 w-3 fill-current" />
                  <span>{movie.popularity} Pop</span>
                </span>
              )}

              <div className="flex items-center gap-1.5 ml-1">
                {movie.genres.map((g) => (
                  <GenreChip key={g.id} name={g.name} />
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="hidden md:flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="h-5 w-5 fill-current" />}
                onClick={onPlayTrailer}
              >
                Watch Trailer
              </Button>

              <WatchlistButton
                isInWatchlist={isBookmarked}
                onClick={handleWatchlistToggle}
                showLabel
                size="lg"
              />

              <FavoriteButton
                isFavorite={isFavorite}
                onClick={handleFavoriteToggle}
                showLabel
                size="lg"
              />

              <Button
                variant="outline"
                size="lg"
                isIconOnly
                onClick={handleShare}
                aria-label="Share Movie"
              >
                {copied ? <Check className="h-5 w-5 text-success" /> : <Share2 className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Main Content & Media (2 Cols Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* 1. Overview Section with Read More Toggle */}
          <OverviewSection overview={movie.overview} />

          {/* 2. Statistics Section (Budget, Revenue, Runtime, Popularity, Rating, Votes) */}
          <StatisticsSection
            budget={movie.budget}
            revenue={movie.revenue}
            runtime={movie.runtime}
            popularity={movie.popularity}
            voteAverage={movie.voteAverage}
            voteCount={movie.voteCount}
          />

          {/* 3. Top Billed Cast Section (Carousel + View Full Cast Modal) */}
          <CastSection
            cast={movie.cast}
            crew={movie.crew}
            movieTitle={movie.title}
          />

          {/* 4. Highlighted Key Crew Section (Grouped by Role) */}
          <CrewSection
            director={movie.director}
            writers={movie.writers}
            crew={movie.crew}
          />

          {/* 5. Collection Franchise Section (if applicable) */}
          <CollectionSection collection={movie.collection} />

          {/* 6. Trailers & Videos Section */}
          <VideosSection
            videos={movie.videos}
            primaryTrailerKey={movie.trailerYoutubeId}
            movieTitle={movie.title}
          />

          {/* 7. Image Gallery Section (with Lightbox Modal) */}
          <ImageGallerySection
            galleryImages={movie.galleryImages}
            screenshots={movie.screenshots}
          />

          {/* 8. Keywords Section */}
          <KeywordsSection keywords={movie.keywords} />

          {/* 9. User & Critic Reviews */}
          <ReviewsSection reviews={movie.reviews} />

          {/* 10. Recommendations Grid */}
          <RecommendationsSection recommendations={movie.recommendations} />

          {/* 11. You May Also Like (Similar Movies Carousel) */}
          <SimilarMoviesSection movies={movie.similarMovies} />
        </div>

        {/* RIGHT COLUMN: Sidebar (Watch Providers, Facts & Production Info) */}
        <aside className="flex flex-col gap-6">
          <WatchProvidersSection providers={movie.watchProviders} />

          <MovieFactsSection
            status={movie.status}
            originalLanguage={movie.originalLanguage}
            releaseDate={movie.releaseDate}
            adult={movie.adult}
            homepage={movie.homepage}
          />

          <ProductionSection
            companies={movie.productionCompanies}
            countries={movie.productionCountries}
            spokenLanguages={movie.spokenLanguages}
          />
        </aside>
      </div>

      {/* 3. STICKY MOBILE ACTION BAR */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 p-4 glass-nav border-t border-white/10 flex items-center gap-3 backdrop-blur-xl">
        <Button
          variant="primary"
          size="md"
          fullWidth
          leftIcon={<Play className="h-4 w-4 fill-current" />}
          onClick={onPlayTrailer}
        >
          Trailer
        </Button>
        <WatchlistButton
          isInWatchlist={isBookmarked}
          onClick={handleWatchlistToggle}
          size="md"
        />
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={handleFavoriteToggle}
          size="md"
        />
        <Button
          variant="outline"
          size="md"
          isIconOnly
          onClick={handleShare}
          aria-label="Share"
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default MovieDetailsView;
