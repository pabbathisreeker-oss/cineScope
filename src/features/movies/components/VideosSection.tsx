import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Play, X, Film, CheckCircle2, Sparkles, Video } from 'lucide-react';
import type { MovieVideo } from '@/features/movies/data/mockMovieDetails';
import { Skeleton } from '@/components/ui/Feedback';

interface VideosSectionProps {
  videos?: MovieVideo[];
  primaryTrailerKey?: string;
  movieTitle?: string;
  isLoading?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Helper function to pick high-res YouTube thumbnail with fallback
const getYoutubeThumbnail = (key: string) => `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;

// ============================================================================
// 1. VIDEO PLAYER MODAL DIALOG
// ============================================================================
export const VideoPlayerModal: React.FC<{
  videoKey: string | null;
  videoTitle?: string;
  onClose: () => void;
}> = ({ videoKey, videoTitle = 'Trailer', onClose }) => {
  // ESC key listener & background scroll lock
  useEffect(() => {
    if (!videoKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoKey, onClose]);

  if (!videoKey) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10 select-none cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl bg-black cursor-default flex flex-col"
        >
          {/* Top Bar with Title & Close Button */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
            <div className="flex items-center space-x-2">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-white line-clamp-1">{videoTitle}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-destructive text-white transition-colors cursor-pointer"
              aria-label="Close Video Player"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lazy Embedded YouTube Player */}
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title={videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// 2. TRAILER HERO COMPONENT
// ============================================================================
export const TrailerHero: React.FC<{
  video: MovieVideo;
  movieTitle?: string;
  onPlay: (video: MovieVideo) => void;
}> = ({ video, movieTitle = 'Movie', onPlay }) => {
  const [thumbSrc, setThumbSrc] = useState(getYoutubeThumbnail(video.key));

  return (
    <motion.div
      whileHover="hover"
      className="relative w-full aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-premium group cursor-pointer"
      onClick={() => onPlay(video)}
    >
      {/* Background Image */}
      <img
        src={thumbSrc}
        alt={video.name || `${movieTitle} Trailer`}
        loading="eager"
        onError={() => setThumbSrc(`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
      />

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Centered Pulsing Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          variants={{
            hover: { scale: 1.15 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-5 sm:p-6 rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_rgba(212,161,90,0.4)] border border-white/20 z-20 flex items-center justify-center"
        >
          <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
        </motion.div>
      </div>

      {/* Hero Overlay Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20 flex flex-col justify-end">
        <div className="flex items-center space-x-2 mb-2">
          {video.official && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              <CheckCircle2 className="h-3 w-3" />
              <span>Official</span>
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            {video.type || 'Trailer'}
          </span>
        </div>

        <h3 className="text-base sm:text-2xl font-display uppercase tracking-wide font-extrabold text-white line-clamp-1 drop-shadow-md">
          {video.name || `${movieTitle} Official Trailer`}
        </h3>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 3. VIDEO CARD COMPONENT (More Videos Grid)
// ============================================================================
export const VideoCard: React.FC<{
  video: MovieVideo;
  onPlay: (video: MovieVideo) => void;
}> = ({ video, onPlay }) => {
  const [thumbSrc, setThumbSrc] = useState(getYoutubeThumbnail(video.key));

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPlay(video)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface/60 border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <img
          src={thumbSrc}
          alt={video.name}
          loading="lazy"
          onError={() => setThumbSrc(`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-4 w-4 fill-current ml-0.5" />
          </div>
        </div>
        {video.type && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
            {video.type}
          </span>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-xs font-bold text-text-primary line-clamp-1 group-hover:text-white transition-colors">
          {video.name}
        </h4>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 4. SKELETON LOADER FOR VIDEOS
// ============================================================================
export const VideoSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full aspect-video sm:aspect-[21/9] rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 5. MAIN VIDEOS SECTION WRAPPER
// ============================================================================
export const VideosSection: React.FC<VideosSectionProps> = ({
  videos = [],
  primaryTrailerKey,
  movieTitle = 'Movie',
  isLoading = false,
}) => {
  const [activeVideo, setActiveVideo] = useState<MovieVideo | null>(null);

  if (isLoading) {
    return <VideoSkeleton />;
  }

  // Build video list
  let availableVideos = [...videos];

  // If no videos array provided but primaryTrailerKey exists, create fallback
  if (availableVideos.length === 0 && primaryTrailerKey) {
    availableVideos.push({
      id: primaryTrailerKey,
      key: primaryTrailerKey,
      name: `${movieTitle} Official Trailer`,
      site: 'YouTube',
      type: 'Trailer',
      official: true,
    });
  }

  // Priority sort: Official Trailer -> Trailer -> Teaser -> Clip -> Featurette
  const getPriority = (v: MovieVideo) => {
    if (v.official && v.type === 'Trailer') return 1;
    if (v.type === 'Trailer') return 2;
    if (v.type === 'Teaser') return 3;
    if (v.type === 'Clip') return 4;
    if (v.type === 'Featurette') return 5;
    return 6;
  };

  availableVideos.sort((a, b) => getPriority(a) - getPriority(b));

  // Primary featured video
  const heroVideo = availableVideos[0];
  const moreVideos = availableVideos.slice(1, 7);

  // Empty State if no videos exist
  if (!heroVideo) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center flex flex-col items-center justify-center my-6">
        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-3">
          <Video className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold font-display uppercase text-white mb-1">No Official Videos Available</h3>
        <p className="text-xs text-muted-foreground">
          Official trailers or video clips for {movieTitle} have not been added yet.
        </p>
      </div>
    );
  }

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6 my-6 select-none"
    >
      {/* Section Header */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
          Trailers & Videos
        </h2>
        <span className="text-xs text-text-muted">({availableVideos.length})</span>
      </div>

      {/* Hero Featured Video */}
      <TrailerHero video={heroVideo} movieTitle={movieTitle} onPlay={(v) => setActiveVideo(v)} />

      {/* Additional Videos Grid */}
      {moreVideos.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold font-display text-text-secondary uppercase tracking-wider">
            More Clips & Featurettes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={(v) => setActiveVideo(v)} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Video Player Modal */}
      <VideoPlayerModal
        videoKey={activeVideo?.key || null}
        videoTitle={activeVideo?.name || `${movieTitle} Trailer`}
        onClose={() => setActiveVideo(null)}
      />
    </motion.section>
  );
};

export default VideosSection;
