import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/motion';
export const Button = ({ variant = 'primary', size = 'md', icon, iconPosition = 'left', loading = false, fullWidth = false, children, className = '', disabled, ...props }) => {
    const baseClasses = `btn btn-${variant} btn-${size}`;
    const widthClass = fullWidth ? 'btn-full' : '';
    const combinedClasses = `${baseClasses} ${widthClass} ${className}`.trim();
    return (_jsxs(motion.button, { className: combinedClasses, disabled: disabled || loading, variants: buttonHover, initial: "rest", whileHover: disabled || loading ? "rest" : "hover", whileTap: disabled || loading ? "rest" : "tap", ...props, children: [loading ? (_jsx("span", { className: "spinner-icon spin", style: { display: 'inline-block', width: 16, height: 16 }, children: "\u2699" })) : (icon && iconPosition === 'left' && _jsx("span", { className: "btn-icon", children: icon })), _jsx("span", { children: children }), !loading && icon && iconPosition === 'right' && _jsx("span", { className: "btn-icon", children: icon })] }));
};
//# sourceMappingURL=Button.js.map