import React from 'react';
import { CineScopeLogo } from '../ui/CineScopeLogo';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in">
      <div className="relative animate-pulse">
        <CineScopeLogo size="lg" variant="icon" showGlow={true} />
      </div>
      <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase animate-pulse">
        Loading CineScope...
      </span>
    </div>
  );
};

export default Loader;
