
import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

// Default animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut" 
    }
  }
};

const MotionWrapper = ({ 
  children, 
  className = "", 
  initial = "hidden",
  animate = "visible",
  variants = fadeIn,
  ...rest 
}: MotionWrapperProps) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
