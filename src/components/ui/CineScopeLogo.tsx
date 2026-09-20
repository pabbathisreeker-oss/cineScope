import React from 'react';
import { cn } from '@/lib/utils';

interface CineScopeLogoProps {
  variant?: 'full' | 'icon' | 'text';
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CineScopeLogo: React.FC<CineScopeLogoProps> = ({
  variant = 'full',
  layout = 'horizontal',
  size = 'md',
  showGlow = true,
  className,
  onClick,
}) => {
  // Size presets
  const sizeMap = {
    sm: { icon: 'h-6 w-auto', text: 'text-lg', gap: 'space-x-2' },
    md: { icon: 'h-8 w-auto', text: 'text-2xl', gap: 'space-x-2.5' },
    lg: { icon: 'h-11 w-auto', text: 'text-3xl', gap: 'space-x-3' },
    xl: { icon: 'h-16 w-auto', text: 'text-5xl', gap: 'space-x-4' },
  };

  const currentSize = sizeMap[size];

  // Vector curved cinemascope screen icon matching user's exact logo artwork
  const CurvedScreenIcon = (
    <div
      className={cn(
        'relative flex items-center justify-center transition-all duration-300 group-hover:scale-[1.04] group-hover:brightness-110',
        showGlow && 'drop-shadow-[0_0_14px_rgba(212,161,90,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(212,161,90,0.6)]'
      )}
    >
      <svg
        viewBox="0 0 100 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('w-auto object-contain', currentSize.icon)}
      >
        <defs>
          <linearGradient id="cinescope-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4A0" />
            <stop offset="50%" stopColor="#D4A15A" />
            <stop offset="100%" stopColor="#B37E36" />
          </linearGradient>
        </defs>

        {/* Curved Cinemascope Outer Frame Contour */}
        <path
          d="M 12 12 Q 50 24 88 12 V 63 Q 50 51 12 63 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
          className="text-foreground group-hover:text-primary transition-colors duration-300"
        />

        {/* Inner Centered Play Triangle */}
        <polygon
          points="42,28 65,37.5 42,47"
          fill="currentColor"
          className="text-foreground group-hover:fill-primary transition-colors duration-300"
        />
      </svg>
    </div>
  );

  // Exact Wordmark: "CineScope" with play icon inside 'o'
  const TextMark = (
    <span
      className={cn(
        'font-sans font-extrabold tracking-tight select-none text-foreground flex items-center leading-none',
        currentSize.text
      )}
    >
      <span>CineSc</span>
      {/* Custom 'o' with embedded play triangle */}
      <span className="relative inline-flex items-center justify-center mx-[0.5px]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[0.85em] w-[0.85em] inline-block align-middle"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
          <polygon points="10,7.5 17,12 10,16.5" fill="currentColor" />
        </svg>
      </span>
      <span>pe</span>
    </span>
  );

  if (variant === 'icon') {
    return (
      <div onClick={onClick} className={cn('inline-flex items-center group cursor-pointer', className)}>
        {CurvedScreenIcon}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div onClick={onClick} className={cn('inline-flex items-center group cursor-pointer', className)}>
        {TextMark}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center group cursor-pointer transition-opacity hover:opacity-95',
        layout === 'vertical' ? 'flex-col space-y-3 text-center' : currentSize.gap,
        className
      )}
    >
      {CurvedScreenIcon}
      {TextMark}
    </div>
  );
};

export default CineScopeLogo;
