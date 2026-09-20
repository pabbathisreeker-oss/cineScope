import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Compass, Sparkles } from 'lucide-react';
import PATHS from '@/routes/paths';

export const EmptyWatchlist: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full py-16 md:py-24 flex flex-col items-center justify-center text-center select-none"
    >
      {/* Graphic Illustration */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform group-hover:scale-110 transition-transform duration-500" />

        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-surface/80 border border-white/10 glass-panel flex items-center justify-center text-primary shadow-premium">
          <Film className="h-14 w-14 md:h-18 md:w-18 opacity-80 stroke-[1.5]" />

          <div className="absolute -top-2 -right-2 p-2 rounded-2xl bg-primary text-primary-foreground shadow-glow-gold animate-bounce-slow">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>

      {/* Message */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wide font-extrabold text-white mb-3">
        Your Watchlist is Empty
      </h2>

      <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        Save movies you want to watch later and keep track of your personal cinema journey.
      </p>

      {/* Discover Movies Action Button */}
      <motion.button
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(PATHS.HOME)}
        className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-glow-gold hover:bg-primary/90 transition-all cursor-pointer"
      >
        <Compass className="h-4 w-4" />
        <span>Discover Movies</span>
      </motion.button>
    </motion.div>
  );
};

export default EmptyWatchlist;
