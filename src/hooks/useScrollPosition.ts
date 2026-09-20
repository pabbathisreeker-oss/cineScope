import { useState, useEffect } from 'react';

/**
 * Hook to monitor the vertical scroll position.
 * Returns true if window.scrollY is greater than the specified threshold.
 */
export const useScrollPosition = (threshold = 20): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check once initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

export default useScrollPosition;
