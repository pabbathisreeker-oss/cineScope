import React from 'react';
import { Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// 1. RATING BADGE
// ==========================================
interface RatingBadgeProps {
  rating: number;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  showIcon = true,
  className,
  size = 'md',
}) => {
  const formattedRating = rating > 0 ? rating.toFixed(1) : 'NR';
  
  return (
    <div className={cn(
      "inline-flex items-center rounded-md font-semibold select-none bg-[#F5C518]/15 text-[#F5C518] border border-[#F5C518]/25",
      size === 'sm' ? "px-1.5 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-sm gap-1.5",
      className
    )}>
      {showIcon && <Star className={cn("fill-[#F5C518]", size === 'sm' ? "h-3.5 w-3.5" : "h-4 w-4")} />}
      <span>{formattedRating}</span>
    </div>
  );
};

// ==========================================
// 2. RUNTIME BADGE
// ==========================================
interface RuntimeBadgeProps {
  minutes: number | null;
  className?: string;
}

export const RuntimeBadge: React.FC<RuntimeBadgeProps> = ({
  minutes,
  className,
}) => {
  if (!minutes) return null;
  
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formattedTime = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  return (
    <div className={cn(
      "inline-flex items-center text-muted-foreground text-xs gap-1 select-none",
      className
    )}>
      <Clock className="h-3.5 w-3.5" />
      <span>{formattedTime}</span>
    </div>
  );
};

// ==========================================
// 3. STREAMING BADGE
// ==========================================
interface StreamingBadgeProps {
  quality: '4K' | 'UHD' | 'HDR' | 'HD';
  className?: string;
}

export const StreamingBadge: React.FC<StreamingBadgeProps> = ({
  quality,
  className,
}) => {
  return (
    <span className={cn(
      "inline-flex px-1.5 py-0.5 rounded text-[10px] font-extrabold select-none border tracking-wider",
      {
        "bg-white/5 text-foreground border-white/20": quality === '4K' || quality === 'UHD',
        "bg-accent/15 text-accent border-accent/30": quality === 'HDR',
        "bg-transparent text-muted-foreground border-border": quality === 'HD',
      },
      className
    )}>
      {quality}
    </span>
  );
};

// ==========================================
// 4. GENRE CHIP
// ==========================================
interface GenreChipProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export const GenreChip: React.FC<GenreChipProps> = ({
  name,
  onClick,
  active = false,
  className,
}) => {
  const Component = onClick ? 'button' : 'span';
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium select-none transition-all",
        onClick && "cursor-pointer hover:bg-surface-hover active:scale-95",
        active
          ? "bg-primary text-primary-foreground font-semibold border border-primary shadow-md shadow-primary/20"
          : "bg-surface text-muted-foreground border border-border hover:text-foreground",
        className
      )}
    >
      {name}
    </Component>
  );
};

export default RatingBadge;

