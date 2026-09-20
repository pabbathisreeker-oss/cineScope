import React from 'react';
import { motion } from 'framer-motion';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl bg-surface/70 border border-white/10 p-5 md:p-6 backdrop-blur-xl shadow-md select-none my-4"
    >
      {/* Section Header */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4 mb-4">
        <div className="p-2 rounded-xl bg-primary/15 text-primary border border-primary/20">
          {icon}
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white font-display uppercase tracking-wider">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Section Children */}
      <div className="space-y-1">{children}</div>
    </motion.div>
  );
};

export default SettingsCard;
