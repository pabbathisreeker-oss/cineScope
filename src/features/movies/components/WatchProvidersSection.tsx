import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Tv, ExternalLink, Globe, PlayCircle, ShoppingBag, CreditCard } from 'lucide-react';
import type { WatchProvidersData, WatchProviderItem } from '@/features/movies/data/mockMovieDetails';
import { Skeleton } from '@/components/ui/Feedback';

interface WatchProvidersSectionProps {
  providers?: WatchProvidersData | null;
  isLoading?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Map country codes to flags/labels
const getCountryLabel = (code: string) => {
  const flags: Record<string, string> = {
    IN: '🇮🇳 India (IN)',
    US: '🇺🇸 United States (US)',
    GB: '🇬🇧 United Kingdom (GB)',
    CA: '🇨🇦 Canada (CA)',
    AU: '🇦🇺 Australia (AU)',
  };
  return flags[code] || `🌐 ${code}`;
};

// ============================================================================
// 1. PROVIDER CARD COMPONENT
// ============================================================================
export const ProviderCard: React.FC<{ provider: WatchProviderItem }> = ({ provider }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-surface/60 border border-white/10 hover:border-white/20 transition-all shadow-md group cursor-pointer"
    >
      {provider.logoPath ? (
        <img
          src={provider.logoPath}
          alt={provider.name}
          loading="lazy"
          className="w-7 h-7 rounded-lg object-contain bg-black shadow-sm group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
          {provider.name[0]}
        </div>
      )}
      <span className="text-xs font-semibold text-white truncate max-w-[120px]">
        {provider.name}
      </span>
    </motion.div>
  );
};

// ============================================================================
// 2. PROVIDER CATEGORY ROW
// ============================================================================
export const ProviderCategory: React.FC<{
  title: string;
  icon: React.ElementType;
  items?: WatchProviderItem[];
}> = ({ title, icon: Icon, items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <ProviderCard key={item.id} provider={item} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 3. PROVIDER SKELETON LOADER
// ============================================================================
export const ProviderSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
      <Skeleton className="h-5 w-40 rounded" />
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN WATCH PROVIDERS SECTION WRAPPER
// ============================================================================
export const WatchProvidersSection: React.FC<WatchProvidersSectionProps> = ({
  providers,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ProviderSkeleton />;
  }

  const hasStream = (providers?.flatrate || []).length > 0;
  const hasRent = (providers?.rent || []).length > 0;
  const hasBuy = (providers?.buy || []).length > 0;
  const hasProviders = hasStream || hasRent || hasBuy;

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="p-6 rounded-2xl glass-panel border border-white/10 space-y-5 shadow-lg select-none"
    >
      {/* Header with Country Badge & TMDB Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <Tv className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-text-primary">
            Where to Watch
          </h2>
          {providers?.countryCode && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white uppercase">
              <Globe className="h-3 w-3 text-primary" />
              <span>{getCountryLabel(providers.countryCode)}</span>
            </span>
          )}
        </div>

        {providers?.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground text-white text-xs font-semibold transition-all cursor-pointer shadow-sm w-fit"
          >
            <span>Watch Options</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Provider Categories */}
      {hasProviders ? (
        <div className="space-y-4">
          <ProviderCategory title="Stream" icon={PlayCircle} items={providers?.flatrate} />
          <ProviderCategory title="Rent" icon={CreditCard} items={providers?.rent} />
          <ProviderCategory title="Buy" icon={ShoppingBag} items={providers?.buy} />
        </div>
      ) : (
        /* Empty State */
        <div className="py-4 text-center space-y-1">
          <p className="text-xs font-medium text-text-muted">
            Streaming information is not available in your region.
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default WatchProvidersSection;
