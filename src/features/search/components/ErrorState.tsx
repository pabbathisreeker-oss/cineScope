import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while loading movies.',
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-16 flex flex-col items-center justify-center select-none"
    >
      <div className="p-8 rounded-3xl bg-surface/80 border border-destructive/20 backdrop-blur-xl text-center max-w-md mx-auto shadow-premium">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-display uppercase tracking-wider font-bold text-white mb-2">
          Unable to Load Results
        </h3>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {message}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-glow-gold hover:bg-primary/90 transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ErrorState;
