import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Sparkles, Command } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (query: string) => void;
  onClear?: () => void;
  onTagClick?: (tag: string) => void;
  autoFocus?: boolean;
}

const PLACEHOLDERS = [
  "Search 'Dune: Part Two'...",
  "Search 'Christopher Nolan'...",
  "Search 'Sci-Fi' or 'Action'...",
  "Search 'Oppenheimer'...",
  "Search 'Denis Villeneuve'...",
  "Search 'The Dark Knight'...",
  "Search 'Tarantino'...",
  "Search 'Hayao Miyazaki'...",
];

const TRENDING_TAGS = [
  { label: 'Dune: Part Two', query: 'Dune: Part Two' },
  { label: 'Oppenheimer', query: 'Oppenheimer' },
  { label: 'Sci-Fi', query: 'Sci-Fi' },
  { label: 'Christopher Nolan', query: 'Christopher Nolan' },
  { label: 'Denis Villeneuve', query: 'Denis Villeneuve' },
  { label: 'Animation', query: 'Animation' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  onTagClick,
  autoFocus = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycling placeholder text animation when query is empty
  useEffect(() => {
    if (value) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [value]);

  // Keyboard shortcut listener ('/' or 'Cmd+K' to focus search input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    } else {
      onChange(value);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Hero Header Typography */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-6 space-y-2"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Cinematic Search Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-wide font-extrabold text-white">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-accent">Cinematic Worlds</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Instantly filter across thousands of movies by title, genre, director, rating, or cast.
        </p>
      </motion.div>

      {/* Large Glowing Search Form */}
      <motion.form
        onSubmit={handleFormSubmit}
        animate={{
          scale: isFocused ? 1.008 : 1,
          boxShadow: isFocused
            ? '0 0 35px rgba(212, 161, 90, 0.22), 0 20px 40px rgba(0, 0, 0, 0.85)'
            : '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className={cn(
          "relative w-full rounded-2xl md:rounded-3xl p-[1.5px] transition-all duration-300 backdrop-blur-2xl",
          isFocused
            ? "bg-gradient-to-r from-primary/60 via-accent/30 to-primary/60"
            : "bg-gradient-to-r from-white/10 via-white/5 to-white/10 hover:from-white/20 hover:to-white/20"
        )}
      >
        <div className={cn(
          "relative flex items-center rounded-[18px] md:rounded-[22px] px-4 md:px-5 py-2.5 md:py-3.5 transition-colors duration-300 shadow-inner",
          isFocused ? "bg-[#070D1E]/95" : "bg-[#091124]/90"
        )}>
          {/* Search Icon */}
          <Search
            className={cn(
              "h-5 w-5 md:h-6 md:w-6 flex-shrink-0 transition-all duration-300 mr-3",
              isFocused ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(212,161,90,0.5)]" : "text-muted-foreground"
            )}
          />

          {/* Animated Placeholder + Input Field */}
          <div className="relative flex-grow flex items-center min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus={autoFocus}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-transparent text-base md:text-lg font-medium text-foreground placeholder-muted-foreground/60 focus:outline-none z-10 py-1"
            />
          </div>

          {/* Clear Button (X) & Keyboard Shortcut & Search Button */}
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            {value ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-full bg-white/10 text-muted-foreground hover:text-foreground hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Clear Search Input"
              >
                <X className="h-4 w-4" />
              </motion.button>
            ) : (
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-muted-foreground font-mono">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            )}

            {/* Gold Search Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-primary-foreground text-xs md:text-sm font-bold flex items-center space-x-1.5 shadow-[0_2px_12px_rgba(212,161,90,0.25)] hover:shadow-[0_4px_20px_rgba(212,161,90,0.45)] hover:brightness-105 active:brightness-95 transition-all cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Quick Trending Search Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs"
      >
        <span className="text-muted-foreground font-medium mr-1 flex items-center space-x-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Trending:</span>
        </span>

        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => {
              if (onTagClick) onTagClick(tag.query);
              if (onSubmit) onSubmit(tag.query);
            }}
            className="px-3 py-1 rounded-full bg-surface/50 border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(212,161,90,0.15)] transition-all cursor-pointer"
          >
            {tag.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchBar;
