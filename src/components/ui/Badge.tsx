import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gold' | 'outline' | 'destructive';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'secondary',
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border",
        {
          "bg-primary/15 text-primary border-primary/30": variant === 'primary',
          "bg-surface text-muted-foreground border-border": variant === 'secondary',
          "bg-accent/15 text-accent border-accent/30": variant === 'accent',
          "bg-[#F5C518]/15 text-[#F5C518] border-[#F5C518]/30": variant === 'gold',
          "bg-transparent text-foreground border-border": variant === 'outline',
          "bg-destructive/15 text-destructive border-destructive/30": variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  );
};

export default Badge;

