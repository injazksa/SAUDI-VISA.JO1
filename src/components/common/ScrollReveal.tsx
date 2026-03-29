import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

/**
 * ScrollReveal Component - Efficient animation trigger on scroll
 * Uses Intersection Observer for optimal performance
 * No animation runs until element is in viewport
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Only animate once
  });

  const directionVariants = {
    up: { y: 30, opacity: 0 },
    down: { y: -30, opacity: 0 },
    left: { x: -30, opacity: 0 },
    right: { x: 30, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // cubic-bezier for smooth motion
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
