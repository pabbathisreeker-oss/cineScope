import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Flame, Award, Clapperboard, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onSelectCategory: (genreIdOrQuery: string) => void;
}

const CATEGORIES = [
  {
    title: 'Sci-Fi Masterpieces',
    query: 'Sci-Fi',
    icon: Sparkles,
    color: 'from-blue-600/30 to-purple-600/30',
    borderColor: 'border-blue-500/30',
    tag: 'Popular',
  },
  {
    title: 'Action & Thrillers',
    query: 'Action',
    icon: Flame,
    color: 'from-accent/30 to-purple-600/30',
    borderColor: 'border-accent/30',
    tag: 'High Energy',
  },
  {
    title: 'Top Rated 9.0+',
    query: 'rating:8.5',
    icon: Award,
    color: 'from-amber-600/30 to-primary/30',
    borderColor: 'border-primary/30',
    tag: 'Critically Acclaimed',
  },
  {
    title: 'Visionary Directors',
    query: 'Christopher Nolan',
    icon: Clapperboard,
    color: 'from-emerald-600/30 to-teal-600/30',
    borderColor: 'border-emerald-500/30',
    tag: 'Featured',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectCategory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto py-8 select-none"
    >
      {/* Category Discovery Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Compass className="h-5 w-5 text-primary animate-spin-slow" />
        <h2 className="text-xl font-display uppercase tracking-wider font-bold text-white">
          Popular Discovery Collections
        </h2>
      </div>

      {/* Grid of Curated Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.query)}
              className={`relative rounded-2xl p-5 bg-gradient-to-br ${cat.color} border ${cat.borderColor} hover:border-white/30 backdrop-blur-xl cursor-pointer overflow-hidden group shadow-premium hover:shadow-card-hover transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300">
                <Icon className="h-16 w-16 text-white" />
              </div>

              <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                {cat.tag}
              </span>

              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1">
                {cat.title}
              </h3>

              <p className="text-xs text-text-secondary flex items-center space-x-1">
                <span>Explore titles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EmptyState;
