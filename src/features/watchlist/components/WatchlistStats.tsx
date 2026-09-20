import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { WatchlistItem } from '../store/useWatchlistStore';

interface WatchlistStatsProps {
  items: WatchlistItem[];
}

export const WatchlistStats: React.FC<WatchlistStatsProps> = ({ items }) => {
  const totalCount = items.length;
  const watchedCount = items.filter((i) => i.isWatched).length;
  const unwatchedCount = totalCount - watchedCount;
  const watchedPercentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  // Estimate total runtime (avg 135 mins per movie)
  const totalMinutes = totalCount * 135;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  if (totalCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 my-6 select-none"
    >
      {/* 1. Total Saved */}
      <div className="p-4 rounded-2xl bg-surface/70 border border-white/10 backdrop-blur-xl flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/20">
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Saved Movies
          </span>
          <span className="text-xl font-display font-extrabold text-white">
            {totalCount}
          </span>
        </div>
      </div>

      {/* 2. Watched Progress */}
      <div className="p-4 rounded-2xl bg-surface/70 border border-white/10 backdrop-blur-xl flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="w-full">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider flex justify-between">
            <span>Watched</span>
            <span className="text-emerald-400">{watchedPercentage}%</span>
          </span>
          <span className="text-xl font-display font-extrabold text-white block">
            {watchedCount} <span className="text-xs font-normal text-text-muted">/ {totalCount}</span>
          </span>
        </div>
      </div>

      {/* 3. Unwatched Remaining */}
      <div className="p-4 rounded-2xl bg-surface/70 border border-white/10 backdrop-blur-xl flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-xl bg-accent/15 text-accent border border-accent/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            To Watch
          </span>
          <span className="text-xl font-display font-extrabold text-white">
            {unwatchedCount}
          </span>
        </div>
      </div>

      {/* 4. Total Runtime */}
      <div className="p-4 rounded-2xl bg-surface/70 border border-white/10 backdrop-blur-xl flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Watch Time
          </span>
          <span className="text-xl font-display font-extrabold text-white">
            {totalHours}h {remainingMins}m
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchlistStats;
