import React from 'react';
export interface ComingSoonFeature {
    title: string;
    description: string;
}
export interface ComingSoonProps {
    moduleTitle: string;
    moduleDescription: string;
    icon: React.ReactNode;
    features?: ComingSoonFeature[];
}
export declare const ComingSoon: React.FC<ComingSoonProps>;
//# sourceMappingURL=ComingSoon.d.ts.map