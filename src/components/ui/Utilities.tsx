import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from './Button';

// ==========================================
// 1. SECTION HEADER
// ==========================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn("flex items-end justify-between select-none mb-6 gap-4", className)}>
      <div className="flex flex-col space-y-1">
        <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// ==========================================
// 2. CAROUSEL CONTROLS
// ==========================================
interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2 select-none", className)}>
      <Button
        variant="secondary"
        size="sm"
        isIconOnly
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        isIconOnly
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// ==========================================
// 3. PAGINATION
// ==========================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <nav className={cn("flex items-center justify-center space-x-1.5 select-none", className)} aria-label="Pagination Navigation">
      <Button
        variant="ghost"
        size="sm"
        isIconOnly
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-xs font-semibold text-text-secondary px-3">
        Page <span className="text-text-primary">{currentPage}</span> of <span className="text-text-primary">{totalPages}</span>
      </span>

      <Button
        variant="ghost"
        size="sm"
        isIconOnly
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

// ==========================================
// 4. BACK BUTTON
// ==========================================
interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = "Back",
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      leftIcon={<ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />}
      onClick={handleBack}
      className={cn("group -ml-3 text-text-secondary hover:text-text-primary cursor-pointer", className)}
    >
      {label}
    </Button>
  );
};
