import React from 'react';
import { motion } from 'framer-motion';

interface LoadingGridProps {
  count?: number;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({ count = 10 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 my-6">
      {skeletons.map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.04 }}
          className="rounded-2xl overflow-hidden glass-card border border-white/[0.08] p-2 flex flex-col space-y-3 shadow-card"
        >
          {/* Poster Skeleton */}
          <div className="aspect-[2/3] w-full rounded-xl bg-white/[0.04] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>

          {/* Info Skeleton */}
          <div className="space-y-2 p-1.5">
            <div className="h-3.5 bg-white/[0.06] rounded-md w-4/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
            <div className="h-2.5 bg-white/[0.04] rounded-md w-2/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingGrid;
