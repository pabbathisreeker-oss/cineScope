import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistButtonProps {
  isInWatchlist: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  isInWatchlist,
  onClick,
  className,
  size = 'md',
  showLabel = false,
}) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06, y: -1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full glass-panel border border-white/[0.08] hover:border-white/20 cursor-pointer shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 backdrop-blur-md select-none",
        {
          "h-8 w-8 p-1.5": size === 'sm' && !showLabel,
          "h-10 w-10 p-2": size === 'md' && !showLabel,
          "h-12 w-12 p-2.5": size === 'lg' && !showLabel,
          "px-4 py-2 space-x-2": showLabel,
        },
        isInWatchlist && "text-accent bg-accent/15 border-accent/40 shadow-[0_0_18px_rgba(124,111,240,0.35)]",
        className
      )}
      aria-label={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      <Bookmark
        className={cn(
          "transition-all duration-300",
          {
            "h-4 w-4": size === 'sm',
            "h-5 w-5": size === 'md',
            "h-6 w-6": size === 'lg',
          },
          isInWatchlist && "fill-accent text-accent scale-105 drop-shadow-[0_0_8px_rgba(124,111,240,0.5)]"
        )}
      />
      {showLabel && (
        <span className="text-xs font-bold text-foreground">
          {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
        </span>
      )}
    </motion.button>
  );
};

export default WatchlistButton;

