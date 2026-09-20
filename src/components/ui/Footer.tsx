import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, MessageCircle, Compass, PlayCircle } from 'lucide-react';
import PATHS from '@/routes/paths';
import { CineScopeLogo } from './CineScopeLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: PATHS.HOME, label: 'Home' },
    { to: PATHS.DISCOVER, label: 'Discover' },
    { to: PATHS.AI_PICKS, label: 'AI Picks' },
    { to: PATHS.WATCHLIST, label: 'Watchlist' },
  ];

  const socialLinks = [
    { href: 'https://twitter.com', icon: Share2, label: 'Share' },
    { href: 'https://github.com', icon: Compass, label: 'Explore' },
    { href: 'https://instagram.com', icon: PlayCircle, label: 'Watch' },
    { href: 'https://youtube.com', icon: MessageCircle, label: 'Community' },
  ];

  return (
    <footer className="relative z-10 border-t border-border bg-surface/30 backdrop-blur-md pt-12 pb-8 transition-colors duration-300 mt-auto">
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-border/60 text-center md:text-left">
          
          {/* Brand & Statement */}
          <div className="flex flex-col items-center md:items-start max-w-sm">
            <Link to={PATHS.HOME} className="mb-3 block">
              <CineScopeLogo size="md" variant="full" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Elevating the cinematic experience. Discover curated titles, personalized AI picks, and unforgettable stories with Apple-grade precision.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social / Action Icons */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-full border border-border bg-surface/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span>&copy; {currentYear} CineScope. Crafted with</span>
            <Heart className="h-3 w-3 text-accent inline fill-accent" />
            <span>for film lovers.</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              TMDB Data
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

