import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between py-3 select-none border-b border-white/5 last:border-b-0">
      <div className="flex items-start space-x-3 pr-4">
        {icon && <div className="mt-0.5 text-primary">{icon}</div>}
        <div>
          <label className="text-xs md:text-sm font-semibold text-white block cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        whileTap={{ scale: 0.92 }}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 focus:outline-none",
          checked ? "bg-primary shadow-glow-gold" : "bg-white/10"
        )}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform ring-0"
        />
      </motion.button>
    </div>
  );
};

export default ToggleSwitch;
