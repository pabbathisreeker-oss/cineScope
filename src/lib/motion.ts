import { type Variants } from 'framer-motion';

// Quick, spring transitions matching premium iOS feel
export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

// Smooth, cinematic ease curve (easeOutExpo)
export const smoothTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.6,
} as const;

// Standard fade-in animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Slide up and fade (standard for cards, text headers)
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: smoothTransition 
  },
  exit: { 
    opacity: 0, 
    y: 15, 
    transition: { duration: 0.2, ease: 'easeIn' } 
  },
};

// Stagger parent container that triggers children animations
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Scale animation for overlays and dialog cards
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: springTransition 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  },
};

// Apple/Netflix-style interactive card animations
export const cardHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    y: -4,
    transition: springTransition,
  },
  tap: { scale: 0.98 },
};

// Page transition shell animation
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.3, ease: 'easeIn' } 
  },
};
