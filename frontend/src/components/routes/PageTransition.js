import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '../../utils/motion';
export const PageTransition = ({ children }) => {
    return (_jsx(motion.div, { variants: fadeIn, initial: "hidden", animate: "visible", exit: "exit", style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }, children: children }));
};
export const SlideUpTransition = ({ children }) => {
    return (_jsx(motion.div, { variants: slideUp, initial: "hidden", animate: "visible", exit: "exit", style: { width: '100%' }, children: children }));
};
//# sourceMappingURL=PageTransition.js.map