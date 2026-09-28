import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardHover } from '../../utils/motion';
export const AnimatedCard = ({ children, className = '', hoverLift = true, ...props }) => {
    const combinedClasses = `arena-card ${className}`.trim();
    return (_jsx(motion.div, { className: combinedClasses, variants: hoverLift ? cardHover : undefined, initial: "rest", whileHover: hoverLift ? "hover" : undefined, whileTap: hoverLift ? "tap" : undefined, ...props, children: children }));
};
//# sourceMappingURL=AnimatedCard.js.map