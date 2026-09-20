import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

// ==========================================
// 1. MODAL
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={cn(
              "w-full glass-panel-heavy rounded-3xl shadow-premium p-6 sm:p-8 flex flex-col relative max-h-[90vh] overflow-y-auto z-10 select-none",
              {
                "max-w-md": size === 'sm',
                "max-w-lg": size === 'md',
                "max-w-2xl": size === 'lg',
                "max-w-4xl": size === 'xl',
              },
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              {title && <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer ml-auto"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 2. DRAWER
// ==========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'right' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  side = 'right',
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={side === 'right' ? { x: '100%' } : { y: '100%' }}
            animate={side === 'right' ? { x: 0 } : { y: 0 }}
            exit={side === 'right' ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
            className={cn(
              "fixed bg-surface shadow-premium z-50 flex flex-col select-none",
              side === 'right' && "top-0 right-0 h-full w-full sm:w-[450px] border-l border-border",
              side === 'bottom' && "bottom-0 left-0 w-full h-[60vh] rounded-t-3xl border-t border-border",
              className
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer ml-auto"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 3. TOOLTIP & POPOVER
// ==========================================
interface TooltipProps {
  content: string;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
}) => {
  const [show, setShow] = React.useState(false);
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-2 py-1 text-[10px] font-bold text-white bg-zinc-950 border border-white/10 rounded-md shadow-md whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none select-none",
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  className,
}) => {
  const [show, setShow] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    if (show) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [show]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setShow(!show)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 mt-2 z-40 glass-panel-heavy rounded-2xl p-4 shadow-premium min-w-[200px] select-none",
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
