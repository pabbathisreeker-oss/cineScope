import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { slideUp } from '@/lib/motion';

// ==========================================
// 1. CONTAINER
// ==========================================
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  clean = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        !clean && "max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 2. SECTION WITH ANIMATED VIEWPORT
// ==========================================
interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  animate?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  title,
  subtitle,
  action,
  animate = true,
  ...props
}) => {
  const Component = animate ? motion.section : 'section';
  const animationProps = animate ? {
    variants: slideUp,
    initial: "initial",
    whileInView: "animate",
    viewport: { once: true, margin: "-100px" }
  } : {};

  return (
    <Component
      className={cn(
        {
          "py-6 sm:py-8": size === 'sm',
          "py-10 sm:py-12": size === 'md',
          "py-16 sm:py-20": size === 'lg',
          "py-24 sm:py-32": size === 'xl',
        },
        className
      )}
      {...animationProps}
      {...(props as any)}
    >
      {(title || subtitle || action) && (
        <div className="flex items-end justify-between select-none mb-6 gap-4">
          <div className="flex flex-col space-y-1">
            {title && (
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs sm:text-sm text-text-secondary">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 z-10">{action}</div>}
        </div>
      )}
      
      {children}
    </Component>
  );
};

// ==========================================
// 3. GRID
// ==========================================
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 'movies' | 'default' | 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 'default',
  gap = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid",
        {
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6": cols === 'movies',
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": cols === 'default',
          
          "grid-cols-1": cols === 1,
          "grid-cols-2": cols === 2,
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-5": cols === 5,
          "grid-cols-6": cols === 6,
          "grid-cols-12": cols === 12,
        },
        {
          "gap-3": gap === 'sm',
          "gap-6": gap === 'md',
          "gap-10": gap === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 4. STACK
// ==========================================
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  gap?: 'sm' | 'md' | 'lg' | 'none';
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  direction = 'col',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex",
        direction === 'row' ? "flex-row" : "flex-col",
        {
          "items-start": align === 'start',
          "items-center": align === 'center',
          "items-end": align === 'end',
          "items-stretch": align === 'stretch',
        },
        {
          "justify-start": justify === 'start',
          "justify-center": justify === 'center',
          "justify-end": justify === 'end',
          "justify-between": justify === 'between',
        },
        {
          "gap-1.5 sm:gap-2.5": gap === 'sm',
          "gap-4 sm:gap-6": gap === 'md',
          "gap-8 sm:gap-10": gap === 'lg',
          "gap-0": gap === 'none',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 5. DIVIDER
// ==========================================
interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = 'horizontal',
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-border self-stretch",
        orientation === 'horizontal' ? "h-[1px] w-full my-4" : "w-[1px] h-full mx-4",
        className
      )}
      {...props}
    />
  );
};
