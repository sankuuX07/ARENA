import React from 'react';
export interface TagInputProps {
    tags: string[];
    onChange: (newTags: string[]) => void;
    placeholder?: string;
    suggestions?: string[];
    variant?: 'primary' | 'info' | 'success' | 'warning' | 'neutral';
}
export declare const TagInput: React.FC<TagInputProps>;
//# sourceMappingURL=TagInput.d.ts.map