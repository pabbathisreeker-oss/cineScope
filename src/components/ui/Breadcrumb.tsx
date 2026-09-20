import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1.5 text-xs font-medium text-text-secondary select-none", className)}>
      <Link to="/" className="hover:text-text-primary transition-colors flex items-center">
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
            {isLast || !item.to ? (
              <span className="text-text-primary font-semibold truncate max-w-[150px] sm:max-w-xs" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="hover:text-text-primary transition-colors truncate max-w-[150px] sm:max-w-xs">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
