import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { DEFAULT_PLACEHOLDERS } from '@/constants';

interface MovieImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: 'poster' | 'backdrop' | 'square' | 'auto';
  className?: string;
}

export const MovieImage: React.FC<MovieImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_PLACEHOLDERS.POSTER,
  aspectRatio = 'auto',
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'poster':
        return 'aspect-[2/3]';
      case 'backdrop':
        return 'aspect-video';
      case 'square':
        return 'aspect-square';
      default:
        return '';
    }
  };

  const imageSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div className={cn('relative overflow-hidden bg-zinc-900', getAspectClass(), className)}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-zinc-800/80 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};

export default React.memo(MovieImage);
