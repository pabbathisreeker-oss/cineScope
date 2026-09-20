import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CoverflowSlide {
  src: string;
  alt?: string;
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  cardWidth?: string | number;
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  gap?: number;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  className?: string;
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
}

export const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({
  slides = [],
  cardWidth = 'clamp(140px, 18vw, 220px)',
  rotate = 42,
  depth = 0.55,
  perspective = 3.2,
  falloff = 0.55,
  fade = 0.12,
  gap = 0.06,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  className,
  initialIndex,
  onSlideChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default to center slide so coverflow displays flanking wings on both left and right
  const defaultInitial =
    initialIndex !== undefined
      ? Math.min(Math.max(0, initialIndex), Math.max(0, slides.length - 1))
      : slides.length > 0
      ? Math.floor(slides.length / 2)
      : 0;

  const [activeIndex, setActiveIndex] = useState(defaultInitial);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Drag calculation references
  const pointerStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Layout measurements
  const [computedCardWidth, setComputedCardWidth] = useState(200);

  // Responsive card width calculation
  useEffect(() => {
    const updateSize = () => {
      if (typeof cardWidth === 'number') {
        setComputedCardWidth(cardWidth);
        return;
      }

      const viewportWidth = window.innerWidth;
      if (viewportWidth < 640) {
        const val = Math.max(160, Math.min(viewportWidth * 0.52, 240));
        setComputedCardWidth(Math.round(val));
      } else if (viewportWidth < 1024) {
        const val = Math.max(220, Math.min(viewportWidth * 0.32, 300));
        setComputedCardWidth(Math.round(val));
      } else if (viewportWidth < 1440) {
        const val = Math.max(280, Math.min(viewportWidth * 0.22, 340));
        setComputedCardWidth(Math.round(val));
      } else {
        const val = Math.max(320, Math.min(viewportWidth * 0.22, 380));
        setComputedCardWidth(Math.round(val));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [cardWidth]);

  // Sync initialIndex or reset when slides change
  useEffect(() => {
    if (slides.length > 0) {
      const newIndex =
        initialIndex !== undefined
          ? Math.min(Math.max(0, initialIndex), slides.length - 1)
          : Math.floor(slides.length / 2);
      setActiveIndex(newIndex);
    }
  }, [slides.length, initialIndex]);

  // Navigate to slide index
  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      setActiveIndex(clamped);
      setDragProgress(0);
      if (onSlideChange) onSlideChange(clamped);
    },
    [slides.length, onSlideChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          const next = Math.max(0, prev - 1);
          if (onSlideChange && next !== prev) onSlideChange(next);
          return next;
        });
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          const next = Math.min(slides.length - 1, prev + 1);
          if (onSlideChange && next !== prev) onSlideChange(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onSlideChange]);

  // Pointer / Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    pointerStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    pointerVelocityRef.current = 0;
    lastTimeRef.current = performance.now();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const clientX = e.clientX;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dx = clientX - lastPointerXRef.current;

    pointerVelocityRef.current = dx / dt;
    lastPointerXRef.current = clientX;
    lastTimeRef.current = now;

    const totalDx = clientX - pointerStartXRef.current;
    const progressOffset = -totalDx / (computedCardWidth * 0.75);

    // Apply gentle dampening at boundaries
    let dampened = progressOffset;
    if (activeIndex + progressOffset < 0) {
      const over = -(activeIndex + progressOffset);
      dampened = -activeIndex - over * 0.3;
    } else if (activeIndex + progressOffset > slides.length - 1) {
      const over = activeIndex + progressOffset - (slides.length - 1);
      dampened = slides.length - 1 - activeIndex + over * 0.3;
    }

    setDragProgress(dampened);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const velocity = pointerVelocityRef.current;
    // Flick momentum offset
    const flickOffset = Math.abs(velocity) > 0.4 ? Math.sign(-velocity) * 1 : 0;
    const projectedTarget = Math.round(activeIndex + dragProgress + flickOffset);
    const clamped = Math.max(0, Math.min(projectedTarget, slides.length - 1));

    setDragProgress(0);
    goToSlide(clamped);
  };

  // Compute 3D Coverflow transform styles for any given card index
  const getCardTransform = (index: number) => {
    const effectiveIndex = activeIndex + dragProgress;
    const diff = index - effectiveIndex;
    const absDiff = Math.abs(diff);
    const sign = Math.sign(diff);

    const cardW = computedCardWidth;
    const centerSpacing = cardW * (0.62 + gap);
    const sideSpacing = cardW * (0.34 + gap);

    let translateX = 0;
    let rotateY = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;

    if (absDiff > 0.001) {
      translateX = sign * (centerSpacing + (absDiff - 1) * sideSpacing);
      rotateY = -sign * rotate;
      translateZ = -absDiff * (cardW * depth);
      scale = Math.max(0.64, 1 - absDiff * (0.11 * falloff));
      opacity = absDiff > 4.5 ? 0 : Math.max(0.18, 1 - absDiff * fade);
    }

    const zIndex = Math.max(1, Math.round(100 - absDiff * 10));
    const isCenter = absDiff < 0.35;

    return {
      transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: (absDiff > 3.5 ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
      isCenter,
    };
  };

  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden select-none py-4 flex flex-col items-center',
        className
      )}
    >
      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[440px] sm:h-[500px] md:h-[560px] lg:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: `${computedCardWidth * perspective}px`,
          transformStyle: 'preserve-3d',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {slides.map((slide, index) => {
          const { transform, opacity, zIndex, pointerEvents, isCenter } = getCardTransform(index);

          return (
            <div
              key={`${slide.title}-${index}`}
              onClick={(e) => {
                if (!isDragging && index !== activeIndex) {
                  e.stopPropagation();
                  goToSlide(index);
                }
              }}
              style={{
                width: `${computedCardWidth}px`,
                aspectRatio: '2/3',
                transform,
                opacity,
                zIndex,
                pointerEvents,
                transformOrigin: 'center center',
                transition: isDragging
                  ? 'none'
                  : 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease',
                willChange: 'transform, opacity',
              }}
              className={cn(
                'absolute flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border',
                isCenter
                  ? 'border-2 border-[#e8a355] shadow-[0_0_45px_rgba(232,163,85,0.45)] ring-2 ring-[#e8a355]/30 cursor-default'
                  : 'border-white/10 hover:border-white/30 cursor-pointer'
              )}
            >
              {/* Poster Image */}
              <img
                src={slide.src}
                alt={slide.alt || slide.title}
                loading="eager"
                draggable={false}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src =
                    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Vignette Overlay for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Dynamic 3D Side Shadow */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/60 transition-opacity duration-300 pointer-events-none',
                  isCenter ? 'opacity-0' : 'opacity-100'
                )}
              />

              {/* Bottom Card Title Tag */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-left pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e8a355] line-clamp-1">
                  {slide.subtitle}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-1 drop-shadow-md">
                  {slide.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Desktop & Tablet) */}
      {showNavigation && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={cn(
              'hidden sm:flex absolute left-4 md:left-8 top-[42%] sm:top-[44%] -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full',
              'bg-[#0a0e1a]/90 border border-white/15 text-white/80 hover:text-white hover:bg-black hover:border-[#e8a355]/60 hover:scale-105',
              'transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer disabled:opacity-20 disabled:pointer-events-none'
            )}
            aria-label="Previous Film"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            type="button"
            onClick={() => goToSlide(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            className={cn(
              'hidden sm:flex absolute right-4 md:right-8 top-[42%] sm:top-[44%] -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full',
              'bg-[#0a0e1a]/90 border border-white/15 text-white/80 hover:text-white hover:bg-black hover:border-[#e8a355]/60 hover:scale-105',
              'transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer disabled:opacity-20 disabled:pointer-events-none'
            )}
            aria-label="Next Film"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Active Movie Caption & Meta Details */}
      {showCaption && activeSlide && (
        <div className="w-full max-w-xl mx-auto px-4 mt-6 text-center flex flex-col items-center animate-fade-in transition-all duration-300">
          {/* Subtitle / Genre Tag */}
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#e8a355] mb-1">
            {activeSlide.subtitle}
          </span>

          {/* Active Film Title */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold uppercase tracking-wide text-white leading-tight drop-shadow-md">
            {activeSlide.title}
          </h3>

          {/* Metadata Badges (Year, Rating, Runtime) */}
          {activeSlide.meta && activeSlide.meta.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-3 text-xs text-slate-300">
              {activeSlide.meta.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  {item.label === 'Rating' && (
                    <Star className="h-3 w-3 text-[#e8a355] fill-[#e8a355]" />
                  )}
                  {item.label === 'Runtime' && (
                    <Clock className="h-3 w-3 text-slate-400" />
                  )}
                  {item.label === 'Year' && (
                    <Calendar className="h-3 w-3 text-slate-400" />
                  )}
                  <span className="text-slate-400 font-medium">{item.label}:</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dot Pagination */}
      {showPagination && slides.length > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-5 z-20">
          {slides.map((_, dotIdx) => (
            <button
              key={`dot-${dotIdx}`}
              type="button"
              onClick={() => goToSlide(dotIdx)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                dotIdx === activeIndex
                  ? 'w-6 bg-gradient-to-r from-[#e8a355] to-amber-500 shadow-[0_0_10px_rgba(232,163,85,0.6)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              )}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverflowCarousel;
