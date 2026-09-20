import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Play,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Award,
  Layers,
  Tag,
  Star,
  Users,
  Flame,
  Clock,
  Building2,
  Languages,
  Image as ImageIcon,
} from 'lucide-react';
import type {
  CastMember,
  ProductionCompany,
  MovieCollection,
} from '@/features/movies/data/mockMovieDetails';
import type { Movie } from '@/types/tmdb';
import { RatingBadge } from '@/components/ui/Badges';
import { Skeleton } from '@/components/ui/Feedback';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Helper function to format large currency values ($185M, $2.3B)
const formatCurrencyShort = (amount?: number): string => {
  if (!amount || amount <= 0) return 'N/A';
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
};

// ============================================================================
// 1. OVERVIEW WITH READ MORE TOGGLE
// ============================================================================
export const OverviewSection: React.FC<{ overview: string }> = ({ overview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = overview.length > 220;

  return (
    <motion.section variants={fadeUpVariants} initial="hidden" animate="visible">
      <h2 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary mb-3">
        Overview
      </h2>

      <div className="relative">
        <p
          className={`text-sm sm:text-base text-text-secondary leading-relaxed font-sans transition-all duration-300 ${
            !isExpanded && isLong ? 'line-clamp-3' : ''
          }`}
        >
          {overview}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            <span>{isExpanded ? '↑' : '↓'}</span>
          </button>
        )}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 2. STATISTICS SECTION (6 Stat Cards)
// ============================================================================
export const StatisticsSection: React.FC<{
  budget: number;
  revenue: number;
  runtime: number;
  popularity?: number;
  voteAverage: number;
  voteCount: number;
}> = ({ budget, revenue, runtime, popularity, voteAverage, voteCount }) => {
  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;
  const runtimeFormatted = runtime > 0 ? `${hours}h ${mins}m` : 'N/A';

  const stats = [
    {
      label: 'Budget',
      value: formatCurrencyShort(budget),
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Revenue',
      value: formatCurrencyShort(revenue),
      icon: DollarSign,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Runtime',
      value: runtimeFormatted,
      icon: Clock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Popularity',
      value: popularity ? `🔥 ${popularity}` : 'N/A',
      icon: Flame,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Avg Rating',
      value: `★ ${voteAverage.toFixed(1)} / 10`,
      icon: Star,
      color: 'text-rating-star bg-rating-star/10 border-rating-star/20',
    },
    {
      label: 'Total Votes',
      value: voteCount ? voteCount.toLocaleString() : 'N/A',
      icon: Users,
      color: 'text-accent bg-accent/10 border-accent/20',
    },
  ];

  return (
    <motion.section variants={fadeUpVariants} initial="hidden" animate="visible" className="w-full">
      <h2 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary mb-4">
        Key Metrics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-surface/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between shadow-md hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-display font-extrabold text-white">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 3. CAST SECTION
// ============================================================================
export const CastSection: React.FC<{ cast: CastMember[]; isLoading?: boolean }> = ({ cast, isLoading }) => {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-lg font-bold font-display text-text-primary mb-4">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!cast || cast.length === 0) return null;

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="text-lg font-bold font-display text-text-primary mb-4">Top Billed Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {cast.map((actor) => (
          <div
            key={actor.id}
            className="flex flex-col rounded-xl overflow-hidden bg-surface/50 border border-white/5 p-2 text-center group hover:border-white/20 transition-all duration-300 shadow-md"
          >
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-2 bg-zinc-900">
              <img
                src={actor.profilePath || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                alt={actor.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="text-xs font-bold text-text-primary line-clamp-1">{actor.name}</h4>
            <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">{actor.character}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 4. COLLECTION SECTION
// ============================================================================
export const CollectionSection: React.FC<{ collection?: MovieCollection | null }> = ({ collection }) => {
  if (!collection) return null;

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/15 p-6 bg-gradient-to-r from-primary/15 via-surface/80 to-surface/90 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {collection.posterPath ? (
            <img
              src={collection.posterPath}
              alt={collection.name}
              className="w-16 h-24 object-cover rounded-xl border border-white/10 shadow-md flex-shrink-0"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-primary/20 text-primary">
              <Layers className="h-8 w-8" />
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
              Part of Franchise
            </span>
            <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wide font-extrabold text-white">
              {collection.name}
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Experience the full cinematic saga and related releases.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// ============================================================================
// 5. KEYWORDS SECTION
// ============================================================================
export const KeywordsSection: React.FC<{ keywords?: string[] }> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <Tag className="h-4 w-4 text-primary" />
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-text-primary">Keywords & Themes</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-surface/80 border border-white/10 text-xs text-text-secondary hover:text-white hover:border-primary/40 transition-colors capitalize cursor-default"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 6. PRODUCTION INFORMATION SECTION
// ============================================================================
export const ProductionSection: React.FC<{
  companies: ProductionCompany[];
  countries?: string[];
  spokenLanguages: string[];
}> = ({ companies, countries, spokenLanguages }) => {
  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="p-6 rounded-2xl glass-panel border border-white/10 space-y-5"
    >
      <h3 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary border-b border-white/10 pb-3 flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-primary" />
        <span>Production & Origin</span>
      </h3>

      {/* Companies */}
      {companies.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-text-muted font-medium block">Production Studios</span>
          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <div
                key={c.id}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary"
              >
                {c.logoPath && (
                  <img src={c.logoPath} alt={c.name} className="h-4 w-auto object-contain max-w-[40px] invert brightness-200" />
                )}
                <span className="font-semibold">{c.name}</span>
                {c.originCountry && (
                  <span className="text-[10px] text-text-muted bg-white/10 px-1.5 py-0.2 rounded">
                    {c.originCountry}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Countries */}
      {countries && countries.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-text-muted font-medium block">Countries</span>
          <p className="text-xs font-semibold text-text-primary">{countries.join(', ')}</p>
        </div>
      )}

      {/* Spoken Languages */}
      {spokenLanguages.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-text-muted font-medium block flex items-center space-x-1">
            <Languages className="h-3.5 w-3.5 text-primary" />
            <span>Spoken Languages</span>
          </span>
          <p className="text-xs font-semibold text-text-primary">{spokenLanguages.join(', ')}</p>
        </div>
      )}
    </motion.section>
  );
};

// ============================================================================
// 7. RECOMMENDATIONS GRID SECTION (6 Responsive Cards)
// ============================================================================
export const RecommendationsSection: React.FC<{ recommendations?: Movie[] }> = ({ recommendations }) => {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold font-display text-text-primary">
          Recommended Movies
        </h2>
        <span className="text-xs text-text-muted">Based on this title</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.slice(0, 6).map((movie) => {
          const posterUrl = movie.poster_path
            ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
            : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';

          return (
            <motion.div
              key={movie.id}
              whileHover={{ y: -6, scale: 1.03 }}
              onClick={() => {
                navigate(`/movie/${movie.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group rounded-2xl overflow-hidden bg-surface/60 border border-white/10 hover:border-white/20 cursor-pointer shadow-md flex flex-col transition-all"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 z-10">
                  <RatingBadge rating={movie.vote_average} size="sm" />
                </div>
              </div>
              <div className="p-2.5 bg-surface/40">
                <h4 className="text-xs font-semibold text-text-primary line-clamp-1 group-hover:text-white transition-colors">
                  {movie.title}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 8. FULLSCREEN LIGHTBOX IMAGE GALLERY
// ============================================================================
export const ImageGallerySection: React.FC<{
  galleryImages?: { backdrops: string[]; posters: string[] };
  screenshots?: string[];
  isLoading?: boolean;
}> = ({ galleryImages, screenshots = [], isLoading }) => {
  const images = (screenshots.length > 0 ? screenshots : galleryImages?.backdrops || []).slice(0, 10);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-text-primary">Media Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return (
      <section className="p-6 rounded-2xl glass-panel border border-white/10 text-center text-text-muted text-xs">
        No media available for this movie.
      </section>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 select-none"
    >
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <ImageIcon className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">Media Gallery</h2>
        <span className="text-xs text-text-muted">({images.length} stills)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {images.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            onClick={() => setSelectedIndex(idx)}
            className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer glass-panel bg-zinc-950"
          >
            <img
              src={src}
              alt={`Movie still ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="h-5 w-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none cursor-pointer"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-destructive transition-colors z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white z-50">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground text-white transition-colors z-50 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[selectedIndex]}
              alt={`Gallery view ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground text-white transition-colors z-50 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

// ============================================================================
// 9. MOVIE FACTS SIDEBAR SECTION
// ============================================================================
export const MovieFactsSection: React.FC<{
  status?: string;
  originalLanguage?: string;
  releaseDate?: string;
  adult?: boolean;
  homepage?: string | null;
}> = ({ status, originalLanguage, releaseDate, adult, homepage }) => {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="p-6 rounded-2xl glass-panel flex flex-col gap-4 border border-white/10"
    >
      <h3 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary border-b border-white/10 pb-3 flex items-center space-x-2">
        <Award className="h-4 w-4 text-primary" />
        <span>Movie Facts</span>
      </h3>

      {status && (
        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
          <span className="text-text-muted">Status</span>
          <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5">{status}</span>
        </div>
      )}

      {releaseDate && (
        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
          <span className="text-text-muted">Release Date</span>
          <span className="font-semibold text-white">{releaseDate}</span>
        </div>
      )}

      {originalLanguage && (
        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
          <span className="text-text-muted">Original Language</span>
          <span className="font-semibold text-white uppercase">{originalLanguage}</span>
        </div>
      )}

      {typeof adult === 'boolean' && (
        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
          <span className="text-text-muted">Adult Rating</span>
          <span className={`font-semibold px-2 py-0.5 rounded ${adult ? 'bg-destructive/20 text-destructive' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {adult ? 'Yes (18+)' : 'No (General)'}
          </span>
        </div>
      )}

      {homepage && (
        <div className="pt-2">
          <a
            href={homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all"
          >
            <span>Visit Official Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
          </a>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// 10. TRAILER SECTION
// ============================================================================
export const TrailerSection: React.FC<{ youtubeId?: string; title?: string }> = ({
  youtubeId,
  title = 'Movie',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeId) return null;

  return (
    <motion.section
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary mb-4">Official Trailer</h2>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-premium">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={`${title} Official Trailer`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer group flex items-center justify-center"
          >
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="p-4 rounded-full bg-primary text-primary-foreground shadow-glow-gold group-hover:scale-110 transition-transform duration-300 z-10">
              <Play className="h-8 w-8 fill-current ml-1" />
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
