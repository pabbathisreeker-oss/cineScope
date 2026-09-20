import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Film, Bookmark, Heart, Clock } from 'lucide-react';
import type { UserProfile } from '../store/useProfileStore';

interface StatsCardsProps {
  profile: UserProfile;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const StatsCards: React.FC<StatsCardsProps> = ({ profile }) => {
  const stats = [
    {
      title: 'Movies Watched',
      value: profile.moviesWatched,
      suffix: 'titles',
      icon: Film,
      color: 'from-primary/20 to-amber-600/10',
      borderColor: 'border-primary/30',
      iconColor: 'text-primary',
    },
    {
      title: 'Watchlist',
      value: profile.watchlistCount,
      suffix: 'saved',
      icon: Bookmark,
      color: 'from-emerald-600/20 to-teal-600/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Favorites',
      value: profile.favoritesCount,
      suffix: 'curated',
      icon: Heart,
      color: 'from-amber-600/20 to-yellow-600/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Hours Watched',
      value: profile.hoursWatched,
      suffix: 'hrs',
      icon: Clock,
      color: 'from-purple-600/20 to-indigo-600/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6 select-none"
    >
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative rounded-2xl p-5 bg-gradient-to-br ${item.color} border ${item.borderColor} backdrop-blur-xl shadow-lg transition-all flex flex-col justify-between overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-secondary">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl bg-white/5 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {item.value}
              </span>
              <span className="text-xs text-text-muted font-medium">
                {item.suffix}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;
