import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../utils/motion';
export const Card = ({ children, hoverLift = false, className = '', ...props }) => {
    const liftClass = hoverLift ? 'hover-lift' : '';
    const combinedClasses = `arena-card ${liftClass} ${className}`.trim();
    return (_jsx(motion.div, { className: combinedClasses, variants: hoverLift ? cardHover : undefined, initial: hoverLift ? "rest" : undefined, whileHover: hoverLift ? "hover" : undefined, whileTap: hoverLift ? "tap" : undefined, ...props, children: children }));
};
//# sourceMappingURL=Card.js.map