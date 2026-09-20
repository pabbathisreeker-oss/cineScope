import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type CombinedButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> & HTMLMotionProps<'button'>;

export interface ButtonProps extends CombinedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'fab' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isIconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isIconOnly = false,
  leftIcon,
  rightIcon,
  whileHover = { scale: 1.02, y: -1.5 },
  whileTap = { scale: 0.97 },
  children,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        
        // Circular for FAB/Icon-Only, otherwise rounded-full
        (isIconOnly || variant === 'fab') ? "rounded-full p-0 aspect-square" : "rounded-full",
        
        // Sizes (padding & text size)
        {
          "px-4 py-1.5 text-xs tracking-wide": size === 'sm' && !isIconOnly && variant !== 'fab',
          "px-6 py-2.5 text-sm font-semibold tracking-wide": size === 'md' && !isIconOnly && variant !== 'fab',
          "px-8 py-3.5 text-base font-bold tracking-wide": size === 'lg' && !isIconOnly && variant !== 'fab',
          
          // Icon-only sizes
          "h-8 w-8": size === 'sm' && (isIconOnly || variant === 'fab'),
          "h-10 w-10": size === 'md' && (isIconOnly || variant === 'fab'),
          "h-12 w-12": size === 'lg' && (isIconOnly || variant === 'fab'),
        },
        
        // Variants
        {
          "bg-gradient-to-r from-primary via-[#DEB26F] to-primary bg-[length:160%_auto] text-primary-foreground font-bold shadow-[0_4px_16px_rgba(212,161,90,0.25)] hover:shadow-[0_6px_26px_rgba(212,161,90,0.42)] hover:brightness-105 active:brightness-95": variant === 'primary',
          "bg-surface/70 text-foreground border border-white/[0.08] backdrop-blur-md hover:bg-surface-hover hover:border-accent/40 hover:text-accent hover:shadow-[0_4px_20px_rgba(124,111,240,0.18)] active:bg-surface/90": variant === 'secondary',
          "border border-white/[0.09] bg-transparent hover:bg-surface/60 hover:border-white/25 text-foreground hover:text-white": variant === 'outline',
          "bg-transparent hover:bg-white/[0.06] text-muted-foreground hover:text-foreground": variant === 'ghost',
          "bg-gradient-to-r from-primary via-[#DEB26F] to-primary text-primary-foreground shadow-[0_8px_25px_rgba(212,161,90,0.4)] hover:shadow-[0_12px_32px_rgba(212,161,90,0.55)] hover:brightness-105": variant === 'fab',
          "bg-destructive text-white hover:bg-destructive-hover shadow-[0_4px_16px_rgba(229,72,77,0.3)] hover:shadow-[0_6px_22px_rgba(229,72,77,0.45)]": variant === 'destructive',
        },
        
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {leftIcon && <span className={cn("inline-flex mr-2", isIconOnly && "mr-0")}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex ml-2">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;

