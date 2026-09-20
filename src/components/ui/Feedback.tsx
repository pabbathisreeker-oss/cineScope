import React from 'react';
import { RotateCcw, AlertTriangle, Film } from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from './Button';

// ==========================================
// 1. SKELETON LOADER
// ==========================================
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-zinc-800/40",
        {
          "rounded-2xl": variant === 'rect',
          "rounded-full aspect-square": variant === 'circle',
          "h-4 rounded-md w-3/4": variant === 'text',
        },
        className
      )}
      {...props}
    />
  );
};

// ==========================================
// 2. SPINNER
// ==========================================
interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
}) => {
  return (
    <div
      className={cn(
        "rounded-full border-2 border-primary/20 border-t-primary animate-spin",
        {
          "h-4 w-4 border": size === 'sm',
          "h-8 w-8 border-2": size === 'md',
          "h-12 w-12 border-3": size === 'lg',
        },
        className
      )}
    />
  );
};

// ==========================================
// 3. PROGRESS BAR
// ==========================================
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
}) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-surface border border-border h-2 rounded-full overflow-hidden relative", className)}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-300 ease-out glow-gold"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

// ==========================================
// 4. EMPTY STATE
// ==========================================
interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No cinematic titles found",
  description = "Check your filters, search queries, or try browsing trending suggestions.",
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-3xl bg-surface/20 min-h-[300px] select-none", className)}>
      <div className="h-16 w-16 rounded-full glass-panel flex items-center justify-center text-muted-foreground mb-4">
        {icon || <Film className="h-7 w-7 text-muted-foreground" />}
      </div>
      <h3 className="font-display uppercase tracking-wider text-xl font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// ==========================================
// 5. ERROR STATE
// ==========================================
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Cinematic Signal Interrupted",
  description = "A connection drop occurred while loading movie registry services.",
  onRetry,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-destructive/20 bg-destructive/[0.03] rounded-3xl min-h-[300px] select-none", className)}>
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="font-display uppercase tracking-wider text-xl font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={onRetry}
          className="border-destructive/30 text-foreground hover:bg-destructive/10 hover:border-destructive/50"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};
