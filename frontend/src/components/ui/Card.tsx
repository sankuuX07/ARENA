import React from 'react';

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
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
