import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Sparkles, Bookmark, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import PATHS from '@/routes/paths';
import { CineScopeLogo } from './CineScopeLogo';

// ==========================================
// 1. COLLAPSIBLE SIDEBAR
// ==========================================
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  className,
}) => {
  const links = [
    { to: PATHS.HOME, label: 'Home', icon: Home },
    { to: PATHS.SEARCH, label: 'Search', icon: Search },
    { to: PATHS.DISCOVER, label: 'Discover', icon: Compass },
    { to: PATHS.AI_PICKS, label: 'AI Picks', icon: Sparkles },
    { to: PATHS.WATCHLIST, label: 'Watchlist', icon: Bookmark },
  ];

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen sticky top-0 bg-surface border-r border-border transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-20",
      className
    )}>
      <div className="h-16 flex items-center px-6 justify-between border-b border-border">
        {isOpen ? (
          <Link to={PATHS.HOME} className="flex items-center">
            <CineScopeLogo size="sm" variant="full" />
          </Link>
        ) : (
          <Link to={PATHS.HOME} className="flex items-center">
            <CineScopeLogo size="sm" variant="icon" />
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-full hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto"
          aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-grow py-6 px-3 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-4 py-3 rounded-full text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

// ==========================================
// 2. MOBILE BOTTOM NAVIGATION
// ==========================================
interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  className,
}) => {
  const location = useLocation();
  const links = [
    { to: PATHS.HOME, label: 'Home', icon: Home },
    { to: PATHS.DISCOVER, label: 'Discover', icon: Compass },
    { to: PATHS.SEARCH, label: 'Search', icon: Search },
    { to: PATHS.WATCHLIST, label: 'Watchlist', icon: Bookmark },
    { to: PATHS.FAVORITES, label: 'Favorites', icon: Sparkles },
  ];

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 w-full z-45 glass-panel border-t border-border py-2 px-3 flex items-center justify-around pb-safe",
      className
    )}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.to === PATHS.HOME 
          ? location.pathname === PATHS.HOME 
          : location.pathname.startsWith(link.to);
          
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={cn(
              "relative flex flex-col items-center justify-center space-y-0.5 w-14 py-1 text-[10px] font-semibold transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
            <span className="truncate max-w-full">{link.label}</span>
            
            {isActive && (
              <motion.div
                layoutId="active-mobile-dot"
                className="absolute -bottom-1 h-1 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(212,161,90,0.6)]"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

