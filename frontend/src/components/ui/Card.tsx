import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../utils/motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = false,
  className = '',
  ...props
}) => {
  const liftClass = hoverLift ? 'hover-lift' : '';
  const combinedClasses = `arena-card ${liftClass} ${className}`.trim();

  return (
    <motion.div 
      className={combinedClasses} 
      variants={hoverLift ? cardHover : undefined}
      initial={hoverLift ? "rest" : undefined}
      whileHover={hoverLift ? "hover" : undefined}
      whileTap={hoverLift ? "tap" : undefined}
      {...props as any}
    >
      {children}
    </motion.div>
  );
};
