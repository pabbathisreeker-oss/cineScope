import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  className,
  error,
  label,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-text-secondary pl-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full bg-surface border border-border text-foreground rounded-2xl px-5 py-3 text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground disabled:opacity-50 resize-y",
          error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-destructive pl-4">{error}</span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
export default TextArea;
