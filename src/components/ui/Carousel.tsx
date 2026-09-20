import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface CarouselProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const Carousel: React.FC<CarouselProps> = ({
  children,
  title,
  subtitle,
  showViewAll = false,
  onViewAll,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragThresholdMet = useRef(false);

  const updateArrows = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const tolerance = 5;
      setShowPrev(el.scrollLeft > tolerance);
      setShowNext(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [children, updateArrows]);

  const scroll = useCallback((direction: 'prev' | 'next') => {
    const el = containerRef.current;
    if (!el) return;
    const offset = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'prev' ? -offset : offset, behavior: 'smooth' });
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scroll('prev'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scroll('next'); }
  }, [scroll]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    setIsDragging(true);
    dragThresholdMet.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) dragThresholdMet.current = true;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const handleCaptureClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragThresholdMet.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("w-full flex flex-col relative select-none", className)}
    >
      {/* Header Row */}
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-5 gap-4">
          <div className="flex items-start space-x-3 min-w-0">
            {/* Subtle cinematic gold accent pill */}
            <span className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-[#DEB26F] to-accent/40 shadow-[0_0_8px_rgba(212,161,90,0.5)] my-0.5" />
            
            <div className="flex flex-col space-y-1 min-w-0">
              {title && (
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-foreground uppercase drop-shadow-sm">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {showViewAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAll}
                className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
              >
                View All
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              isIconOnly
              onClick={() => scroll('prev')}
              disabled={!showPrev}
              aria-label="Scroll left"
              className="border-white/[0.08] hover:border-primary/40 hover:text-primary transition-colors shadow-sm disabled:opacity-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              isIconOnly
              onClick={() => scroll('next')}
              disabled={!showNext}
              aria-label="Scroll right"
              className="border-white/[0.08] hover:border-primary/40 hover:text-primary transition-colors shadow-sm disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Scroll Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label={title ? `${title} carousel` : 'Movie carousel'}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleCaptureClick}
        className={cn(
          "flex overflow-x-auto gap-4 py-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg",
          isDragging ? "scroll-auto" : "scroll-smooth"
        )}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3), ease: "easeOut" }}
            className="snap-start flex-shrink-0 w-[140px] sm:w-[165px] md:w-[195px] lg:w-[210px]"
          >
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Carousel;

