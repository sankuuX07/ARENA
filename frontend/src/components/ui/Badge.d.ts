import React from 'react';
export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Badge: React.FC<BadgeProps>;
//# sourceMappingURL=Badge.d.ts.map