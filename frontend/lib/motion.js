// Framer Motion Animation Variants

export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4 } 
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.3 } 
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.3 } 
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 20 
    } 
  },
};

export const hoverScale = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95 
  },
};
