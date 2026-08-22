import { Variants } from 'framer-motion';

// Standard transition to keep things consistent and snappy
export const standardTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Fade In
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.3, ease: 'easeIn' }
  },
};

// Slide Up
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3, ease: 'easeIn' }
  },
};

// Scale In (for modals, cards)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.3, ease: 'easeIn' }
  },
};

// Stagger Container (for lists, grids)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Item for Stagger Container
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// Card Hover variants
export const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02, 
    boxShadow: '0 14px 35px -10px rgba(0, 0, 0, 0.6)',
    borderColor: 'var(--border-color-glow)'
  },
  tap: { scale: 0.98 }
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.96 }
};
