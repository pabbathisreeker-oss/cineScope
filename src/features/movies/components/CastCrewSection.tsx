import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Users, Search, X, Clapperboard, Sparkles } from 'lucide-react';
import type { CastMember, CrewMember } from '@/features/movies/data/mockMovieDetails';
import { Skeleton } from '@/components/ui/Feedback';

interface CastCardProps {
  member: CastMember;
}

const cardHoverVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ============================================================================
// 1. CAST CARD COMPONENT
// ============================================================================
export const CastCard: React.FC<CastCardProps> = ({ member }) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials if profile image is unavailable
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      variants={cardHoverVariants}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-32 sm:w-36 md:w-40 flex flex-col rounded-2xl overflow-hidden bg-surface/60 border border-border p-2.5 text-center group hover:border-primary/50 hover:shadow-card-hover transition-all duration-300 backdrop-blur-md select-none cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-2 bg-background flex items-center justify-center">
        {!imageError && member.profilePath ? (
          <img
            src={member.profilePath}
            alt={member.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-background text-muted-foreground p-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm mb-1 border border-primary/30">
              {getInitials(member.name)}
            </div>
            <User className="h-4 w-4 opacity-50" />
          </div>
        )}
      </div>

      <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {member.name}
      </h4>
      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 font-medium">
        {member.character}
      </p>
    </motion.div>
  );
};

// ============================================================================
// 2. SKELETON CAST CARD
// ============================================================================
export const SkeletonCastCard: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-32 sm:w-36 md:w-40 rounded-2xl bg-surface/60 border border-border p-2.5 flex flex-col space-y-2">
      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      <Skeleton className="h-3.5 w-3/4 rounded mx-auto" />
      <Skeleton className="h-2.5 w-1/2 rounded mx-auto" />
    </div>
  );
};

// ============================================================================
// 3. HIGHLIGHTED CREW SECTION (Grouped by Role)
// ============================================================================
export const CrewSection: React.FC<{
  director: CrewMember;
  writers: CrewMember[];
  crew?: CrewMember[];
  isLoading?: boolean;
}> = ({ director, writers, crew = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl glass-panel border border-border space-y-4">
        <Skeleton className="h-6 w-36 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    );
  }

  // Group key crew members by role
  const crewMap = new Map<string, string[]>();

  // Add Director
  if (director?.name) {
    crewMap.set('Director', [director.name]);
  }

  // Add Writers / Screenplay
  if (writers && writers.length > 0) {
    crewMap.set('Screenplay', writers.map((w) => w.name));
  }

  // Group producers, cinematography, music, editing from full crew array
  if (crew && crew.length > 0) {
    crew.forEach((c) => {
      const job = c.job;
      if (
        [
          'Producer',
          'Executive Producer',
          'Director of Photography',
          'Original Music Composer',
          'Editor',
          'Production Design',
        ].includes(job)
      ) {
        const existing = crewMap.get(job) || [];
        if (!existing.includes(c.name) && existing.length < 3) {
          crewMap.set(job, [...existing, c.name]);
        }
      }
    });
  }

  if (crewMap.size === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl glass-panel border border-border space-y-4 shadow-lg select-none"
    >
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <Clapperboard className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">
          Key Creative Team
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(crewMap.entries()).map(([role, names]) => (
          <div key={role} className="p-3 rounded-xl bg-surface/70 border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {role}
            </span>
            <p className="text-xs font-semibold text-foreground mt-1 leading-snug">
              {names.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

// ============================================================================
// 4. FULL CAST & CREW MODAL DIALOG
// ============================================================================
export const FullCastModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cast: CastMember[];
  crew: CrewMember[];
  movieTitle: string;
}> = ({ isOpen, onClose, cast, crew, movieTitle }) => {
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCast = cast.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.character.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCrew = crew.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.job.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                Credits Registry
              </span>
              <h2 className="text-xl font-bold font-display text-foreground">
                Full Cast & Crew — {movieTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Controls: Search & Tabs */}
          <div className="p-4 bg-surface/80 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center space-x-2 bg-background p-1 rounded-full border border-border w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('cast')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'cast'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Cast ({cast.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('crew')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'crew'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Crew ({crew.length})
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actor, character, or role..."
                className="w-full bg-background border border-border rounded-full pl-9 pr-4 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {activeTab === 'cast' ? (
              filteredCast.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredCast.map((actor, idx) => (
                    <div
                      key={`${actor.id}-${idx}`}
                      className="flex items-center space-x-3 p-2.5 rounded-xl bg-surface/60 border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-background flex-shrink-0 flex items-center justify-center border border-border">
                        {actor.profilePath ? (
                          <img
                            src={actor.profilePath}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-surface text-primary font-bold text-xs">
                            {actor.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-xs font-bold text-foreground truncate">{actor.name}</h4>
                        <p className="text-[11px] text-muted-foreground truncate">{actor.character}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No cast members match "{searchQuery}".
                </p>
              )
            ) : filteredCrew.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCrew.map((c, idx) => (
                  <div
                    key={`${c.id}-${c.job}-${idx}`}
                    className="p-3 rounded-xl bg-surface/60 border border-border flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{c.name}</h4>
                      <span className="text-[10px] text-primary font-semibold uppercase">{c.job}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No crew members match "{searchQuery}".
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// 5. MAIN CAST SECTION WITH CAROUSEL & FULL CAST TRIGGER
// ============================================================================
export const CastSection: React.FC<{
  cast: CastMember[];
  crew?: CrewMember[];
  movieTitle?: string;
  isLoading?: boolean;
}> = ({ cast = [], crew = [], movieTitle = 'Movie', isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4 my-6">
        <h2 className="text-lg font-bold font-display text-foreground">Top Billed Cast</h2>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCastCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!cast || cast.length === 0) return null;

  const topCast = cast.slice(0, 12);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4 my-6 select-none"
    >
      {/* Section Header with Carousel Arrows */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
            Top Billed Cast
          </h2>
          <span className="text-xs text-muted-foreground">({cast.length} actors)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-surface/80 hover:bg-primary hover:text-primary-foreground border border-border text-foreground transition-colors cursor-pointer"
            aria-label="Scroll Cast Left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-surface/80 hover:bg-primary hover:text-primary-foreground border border-border text-foreground transition-colors cursor-pointer"
            aria-label="Scroll Cast Right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x"
      >
        {topCast.map((member) => (
          <div key={member.id} className="snap-start">
            <CastCard member={member} />
          </div>
        ))}
      </div>

      {/* View Full Cast Action Button */}
      <div className="pt-1 flex justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-surface/80 hover:bg-surface-hover hover:border-accent/40 border border-border text-xs font-semibold text-foreground hover:text-accent transition-all cursor-pointer shadow-md"
        >
          <Users className="h-3.5 w-3.5 text-accent" />
          <span>View Full Cast & Crew</span>
        </motion.button>
      </div>

      {/* Full Cast Modal Dialog */}
      <FullCastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cast={cast}
        crew={crew}
        movieTitle={movieTitle}
      />
    </motion.section>
  );
};

export default CastSection;

