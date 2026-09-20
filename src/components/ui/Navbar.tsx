import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import PATHS from '@/routes/paths';
import useScrollPosition from '@/hooks/useScrollPosition';
import useAuthStore from '@/store/useAuthStore';
import { UserMenu } from './Profile';
import { CineScopeLogo } from './CineScopeLogo';

export const Navbar: React.FC = () => {
  const isScrolled = useScrollPosition(20);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: PATHS.HOME, label: 'Home' },
    { to: PATHS.DISCOVER, label: 'Discover' },
    { to: PATHS.SEARCH, label: 'Search' },
    { to: PATHS.WATCHLIST, label: 'Watchlist' },
    { to: PATHS.FAVORITES, label: 'Favorites' },
  ];

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
      }
    };
    if (searchExpanded) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [searchExpanded]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${PATHS.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchExpanded(false);
      setSearchQuery('');
    } else {
      navigate(PATHS.SEARCH);
      setSearchExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleSearchIconClick = () => {
    if (!searchExpanded) {
      setSearchExpanded(true);
    } else {
      if (searchQuery.trim()) {
        handleSearchSubmit();
      } else {
        setSearchExpanded(false);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "py-3 glass-nav-scrolled"
          : "py-4 md:py-5 bg-gradient-to-b from-[#030B1B]/90 via-[#030B1B]/40 to-transparent backdrop-blur-[6px] border-b border-white/[0.04]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to={PATHS.HOME}
          className="z-10 flex items-center group transition-all duration-300 hover:brightness-110"
        >
          <CineScopeLogo size="md" variant="full" />
        </Link>

        <nav className="hidden md:flex items-center space-x-1 bg-surface/50 border border-white/[0.08] rounded-full p-1 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] select-none z-10">
          {navLinks.map((link) => {
            const isActive = link.to === PATHS.HOME 
              ? location.pathname === PATHS.HOME 
              : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 group/nav",
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(212,161,90,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-navbar-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/35 rounded-full z-0 shadow-[0_0_18px_rgba(212,161,90,0.25)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    {/* Subtle bottom glow dot for active page */}
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(212,161,90,0.8)]" />
                  </motion.div>
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3 sm:space-x-4 z-10">
          <div ref={searchContainerRef} className="relative flex items-center">
            <form onSubmit={handleSearchSubmit}>
              <motion.div
                initial={false}
                animate={{ width: searchExpanded ? 240 : 38 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={cn(
                  "h-9 flex items-center bg-surface/70 border rounded-full transition-all duration-300 backdrop-blur-xl",
                  searchExpanded
                    ? "border-primary/60 pr-2 pl-4 shadow-[0_0_20px_rgba(212,161,90,0.25)] bg-[#0B132B]/95"
                    : "border-white/[0.08] hover:bg-surface-hover hover:border-white/20 justify-center shadow-sm"
                )}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Titles, actors, genres..."
                  className={cn(
                    "w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none",
                    !searchExpanded && "pointer-events-none opacity-0"
                  )}
                />
                
                <button
                  type="button"
                  onClick={handleSearchIconClick}
                  className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  aria-label="Search Catalog"
                >
                  {searchExpanded ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </motion.div>
            </form>
          </div>

          {isLoading ? (
            <div
              className="h-9 w-20 rounded-full bg-surface/50 border border-white/[0.06] animate-pulse backdrop-blur-md"
              aria-label="Checking authentication status"
            />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              to={PATHS.SIGN_IN}
              className="h-9 px-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-xs font-bold text-primary-foreground shadow-[0_2px_12px_rgba(212,161,90,0.25)] hover:shadow-[0_4px_20px_rgba(212,161,90,0.45)] hover:brightness-105 active:scale-95 transition-all duration-300 select-none cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

