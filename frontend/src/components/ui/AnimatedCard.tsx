import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardHover } from '../../utils/motion';

export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverLift = true,
  ...props
}) => {
  const combinedClasses = `arena-card ${className}`.trim();

  return (
    <motion.div
      className={combinedClasses}
      variants={hoverLift ? cardHover : undefined}
      initial="rest"
      whileHover={hoverLift ? "hover" : undefined}
      whileTap={hoverLift ? "tap" : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};
