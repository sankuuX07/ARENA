import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `btn btn-${variant} btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseClasses} ${widthClass} ${className}`.trim();

  return (
    <motion.button
      className={combinedClasses}
      disabled={disabled || loading}
      variants={buttonHover}
      initial="rest"
      whileHover={disabled || loading ? "rest" : "hover"}
      whileTap={disabled || loading ? "rest" : "tap"}
      {...props as any}
    >
      {loading ? (
        <span className="spinner-icon spin" style={{ display: 'inline-block', width: 16, height: 16 }}>
          ⚙
        </span>
      ) : (
        icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </motion.button>
  );
};
