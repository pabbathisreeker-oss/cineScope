import React from 'react';
import { Link } from 'react-router-dom';
import PATHS from '@/routes/paths';

const NotFoundPage: React.FC = () => {
  return (
    <div className="relative py-24 text-center animate-fade-in flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10" />

      <h1 className="text-8xl md:text-9xl font-display font-extrabold text-primary mb-4 tracking-wider drop-shadow-glow">404</h1>
      <h2 className="text-3xl font-display font-bold uppercase tracking-wider text-white mb-2">Cinematic Reel Ended</h2>
      <p className="text-muted-foreground mb-8 text-sm max-w-sm">The screen you are trying to view does not exist or has been archived.</p>
      <Link to={PATHS.HOME} className="px-6 py-3 bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-black rounded-full font-bold shadow-glow-gold hover:brightness-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
        Return to Theatre
      </Link>
    </div>
  );
};

export default NotFoundPage;
