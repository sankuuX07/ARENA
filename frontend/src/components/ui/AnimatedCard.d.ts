import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverLift?: boolean;
}
export declare const AnimatedCard: React.FC<AnimatedCardProps>;
//# sourceMappingURL=AnimatedCard.d.ts.map