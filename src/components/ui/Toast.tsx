import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  isOpen: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-55 max-w-sm w-full"
        >
          <div className="glass-panel-heavy shadow-premium p-4 rounded-2xl flex items-start space-x-3.5 select-none border border-border">
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            
            <div className="flex-grow min-w-0 pr-2">
              <p className="text-sm font-semibold text-foreground mb-0.5">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground leading-normal">{message}</p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

