import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Edit3, ShieldCheck, Film, Bookmark } from 'lucide-react';
import type { UserProfile } from '../store/useProfileStore';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full rounded-3xl bg-surface/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl overflow-hidden shadow-premium select-none my-6"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Avatar + Main User Details */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          {/* Avatar frame with subtle rotating glow */}
          <div className="relative group">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2px] overflow-hidden flex items-center justify-center shadow-glow-gold">
              {/* Subtle slow rotating glow border */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,161,90,0.7)_120deg,rgba(168,85,247,0.4)_240deg,transparent_360deg)] animate-rotate-glow pointer-events-none" />
              <div className="relative w-full h-full rounded-full p-0.5 bg-background">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full border border-white/20"
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-black shadow-md border-2 border-background" title="Pro Cinephile">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          {/* Text details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-wider font-extrabold text-white">
                {profile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-wider">
                Pro Cinephile
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {profile.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-text-muted">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Member since {profile.memberSince}</span>
              </span>

              <span className="hidden sm:inline">•</span>

              <span className="flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Fav: <strong className="text-white">{profile.favoriteGenre}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges + Edit Profile Action */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-surface/90 border border-white/10 flex items-center space-x-2">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-text-muted">Watched:</span>
              <strong className="text-white font-bold">{profile.moviesWatched}</strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-surface/90 border border-white/10 flex items-center space-x-2">
              <Bookmark className="h-4 w-4 text-emerald-400" />
              <span className="text-text-muted">Watchlist:</span>
              <strong className="text-white font-bold">{profile.watchlistCount}</strong>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEditClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
