import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}) => {
  return (
    <div className={cn(
      "flex items-center select-none",
      variant === 'pills' && "bg-surface border border-border p-1 rounded-full space-x-1",
      variant === 'underline' && "border-b border-border w-full space-x-4",
      className
    )}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-colors duration-250",
              {
                "text-muted-foreground hover:text-foreground": variant === 'pills' && !isActive,
                "text-primary-foreground font-bold": variant === 'pills' && isActive,
                
                "text-muted-foreground hover:text-foreground pb-3 rounded-none px-5 border-b-2 border-transparent -mb-[1px]": variant === 'underline' && !isActive,
                "text-primary pb-3 rounded-none px-5 border-b-2 border-primary -mb-[1px] font-bold": variant === 'underline' && isActive,
              }
            )}
          >
            {variant === 'pills' && isActive && (
              <motion.div
                layoutId="active-pill-tab"
                className="absolute inset-0 bg-primary rounded-full z-0 shadow-md shadow-primary/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

