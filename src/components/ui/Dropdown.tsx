import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className={cn("w-full flex flex-col space-y-1.5 relative", className)} ref={containerRef}>
      {label && (
        <span className="text-xs font-semibold text-muted-foreground pl-1 uppercase tracking-wider">
          {label}
        </span>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between bg-surface border border-border text-foreground rounded-full px-5 py-3 text-sm cursor-pointer transition-all hover:bg-surface-hover focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
          isOpen && "border-primary ring-2 ring-primary/15"
        )}
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full z-50 glass-panel-heavy rounded-2xl py-2 mt-1 shadow-premium overflow-hidden max-h-60 overflow-y-auto border border-border"
          >
            {options.length === 0 ? (
              <li className="px-5 py-2.5 text-sm text-muted-foreground">No options available</li>
            ) : (
              options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-2.5 text-sm cursor-pointer transition-colors text-foreground hover:bg-surface-hover",
                      option.value === value && "text-primary bg-primary/10 font-semibold"
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;

