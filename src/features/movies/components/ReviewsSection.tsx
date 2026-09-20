import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Star, MessageSquare, ChevronDown, ChevronUp, User, Sparkles } from 'lucide-react';
import type { MovieReview } from '@/features/movies/data/mockMovieDetails';
import { Skeleton } from '@/components/ui/Feedback';

interface ReviewsSectionProps {
  reviews?: MovieReview[];
  isLoading?: boolean;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Compute initials if profile avatar is missing
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// ============================================================================
// 1. REVIEW CARD COMPONENT
// ============================================================================
export const ReviewCard: React.FC<{ review: MovieReview }> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLong = review.content.length > 280;

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all shadow-md flex flex-col gap-4 select-none"
    >
      {/* Header Row: Avatar, Author, Rating, Date */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-white/15 flex-shrink-0 flex items-center justify-center">
            {!imageError && review.avatarPath ? (
              <img
                src={review.avatarPath}
                alt={review.author}
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {getInitials(review.author) || <User className="h-4 w-4" />}
              </div>
            )}
          </div>

          {/* Author & Date */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{review.author}</h4>
            <span className="text-[11px] font-medium text-text-muted block">
              {review.createdAt}
            </span>
          </div>
        </div>

        {/* Rating Badge (if present) */}
        {typeof review.rating === 'number' && (
          <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-rating-star/10 border border-rating-star/20 text-rating-star text-xs font-bold flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{review.rating} / 10</span>
          </div>
        )}
      </div>

      {/* Review Content with Read More Toggle */}
      <div className="relative text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
        <p className={!isExpanded && isLong ? 'line-clamp-4' : ''}>{review.content}</p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// 2. REVIEW SKELETON
// ============================================================================
export const ReviewSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded" />
    </div>
  );
};

// ============================================================================
// 3. MAIN REVIEWS SECTION WRAPPER
// ============================================================================
export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews = [],
  isLoading = false,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);

  if (isLoading) {
    return (
      <section className="space-y-4 my-6">
        <h2 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">⭐ Reviews</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Empty State if no reviews exist
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center flex flex-col items-center justify-center my-6">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold font-display uppercase text-white mb-0.5">No Reviews Available Yet</h3>
        <p className="text-xs text-muted-foreground">
          Be the first critic to share feedback on this title.
        </p>
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, visibleCount);
  const hasMore = reviews.length > visibleCount;

  return (
    <motion.section
      variants={fadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 my-6 select-none"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
          User & Critic Reviews
        </h2>
        <span className="text-xs text-text-muted">({reviews.length})</span>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <AnimatePresence>
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-2 flex justify-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-surface/80 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
          >
            <span>Load More Reviews ({reviews.length - visibleCount} remaining)</span>
            <ChevronDown className="h-3.5 w-3.5 text-primary" />
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};

export default ReviewsSection;
