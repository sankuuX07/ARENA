import React from 'react';
export interface NavItem {
    id: string;
    path: string;
    label: string;
    iconName: string;
    icon: React.ComponentType<{
        size?: number | string;
        className?: string;
    }>;
    description: string;
    category: 'core' | 'prep' | 'assessment' | 'social';
    isComingSoon?: boolean;
}
export declare const NAV_ITEMS: NavItem[];
//# sourceMappingURL=navigation.d.ts.map