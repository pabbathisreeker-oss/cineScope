import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  error,
  icon,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col space-y-1">
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-surface border border-border text-foreground rounded-full px-5 py-3 text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground disabled:opacity-50",
            icon && "pl-11",
            error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-destructive pl-4">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

