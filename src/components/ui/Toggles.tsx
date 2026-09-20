import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// 1. TOGGLE SWITCH
// ==========================================
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label className={cn("inline-flex items-center space-x-3 cursor-pointer select-none", disabled && "pointer-events-none opacity-50", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <div className={cn(
          "w-11 h-6 bg-surface border border-border rounded-full transition-colors duration-200",
          checked && "bg-primary border-primary shadow-[0_0_12px_rgba(212,161,90,0.4)]"
        )} />
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-0.5 h-4 w-4 bg-primary-foreground rounded-full shadow-md"
        />
      </div>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
};

// ==========================================
// 2. CHECKBOX
// ==========================================
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label className={cn("inline-flex items-center space-x-3 cursor-pointer select-none", disabled && "pointer-events-none opacity-50", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <div className={cn(
          "w-5 h-5 bg-surface border border-border rounded-md flex items-center justify-center transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50",
          checked && "bg-primary border-primary shadow-[0_0_10px_rgba(212,161,90,0.4)]"
        )}>
          {checked && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3px]" />}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
};

// ==========================================
// 3. RADIO BUTTON
// ==========================================
interface RadioButtonProps {
  checked: boolean;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  name,
  value,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label className={cn("inline-flex items-center space-x-3 cursor-pointer select-none", disabled && "pointer-events-none opacity-50", className)}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
          disabled={disabled}
        />
        <div className={cn(
          "w-5 h-5 bg-surface border border-border rounded-full flex items-center justify-center transition-all duration-200",
          checked && "border-primary"
        )}>
          {checked && (
            <motion.div
              layoutId={`radio-dot-${name}`}
              className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,161,90,0.5)]"
              transition={{ type: 'spring', stiffness: 550, damping: 28 }}
            />
          )}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;

