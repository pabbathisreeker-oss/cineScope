import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
  variant?: 'default' | 'outline' | 'accent';
  size?: 'sm' | 'md';
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onClick,
  icon,
  count,
  size = 'md',
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center space-x-1.5 rounded-full font-medium transition-all duration-300 cursor-pointer select-none whitespace-nowrap",
        size === 'sm' ? "px-3 py-1 text-xs" : "px-4 py-2 text-xs md:text-sm",
        isActive
          ? "bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-primary-foreground shadow-[0_2px_14px_rgba(212,161,90,0.35)] border border-primary/90 font-bold"
          : "bg-surface/50 text-muted-foreground hover:text-foreground border border-white/[0.08] hover:border-white/20 hover:bg-surface/80 backdrop-blur-md"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-chip-glow"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-[#DEB26F] to-primary z-0 shadow-[0_0_18px_rgba(212,161,90,0.35)]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      <span className="relative z-10 flex items-center space-x-1.5">
        {icon && <span className="opacity-90">{icon}</span>}
        <span>{label}</span>
        {typeof count === 'number' && (
          <span
            className={cn(
              "ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              isActive ? "bg-white/20 text-white" : "bg-white/10 text-text-muted"
            )}
          >
            {count}
          </span>
        )}
      </span>
    </motion.button>
  );
};

export default FilterChip;
