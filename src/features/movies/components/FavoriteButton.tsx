import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
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
        isFavorite && "text-[#E5484D] bg-[#E5484D]/15 border-[#E5484D]/40 shadow-[0_0_18px_rgba(229,72,77,0.35)]",
        className
      )}
      aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart
        className={cn(
          "transition-all duration-300",
          {
            "h-4 w-4": size === 'sm',
            "h-5 w-5": size === 'md',
            "h-6 w-6": size === 'lg',
          },
          isFavorite ? "fill-[#E5484D] stroke-[#E5484D] scale-110 drop-shadow-[0_0_8px_rgba(229,72,77,0.6)]" : "hover:text-[#E5484D]"
        )}
      />
      {showLabel && (
        <span className="text-xs font-bold text-foreground">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </motion.button>
  );
};

export default FavoriteButton;

