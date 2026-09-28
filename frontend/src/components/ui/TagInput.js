import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from './Badge';
export const TagInput = ({ tags = [], onChange, placeholder = 'Add new tag...', suggestions = [], variant = 'primary', }) => {
    const [inputValue, setInputValue] = useState('');
    const handleAddTag = (tagToAdd) => {
        const trimmed = tagToAdd.trim();
        if (!trimmed)
            return;
        // Duplicate check (case-insensitive)
        const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
        if (!exists) {
            onChange([...tags, trimmed]);
        }
        setInputValue('');
    };
    const handleRemoveTag = (tagToRemove) => {
        onChange(tags.filter((t) => t !== tagToRemove));
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(inputValue);
        }
    };
    return (_jsxs("div", { className: "tag-input-container", children: [_jsxs("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }, children: [tags.map((tag, index) => (_jsxs(Badge, { variant: variant, style: { paddingRight: '0.4rem', fontSize: '0.82rem' }, children: [_jsx("span", { children: tag }), _jsx("button", { type: "button", onClick: () => handleRemoveTag(tag), style: {
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'currentColor',
                                    cursor: 'pointer',
                                    marginLeft: '0.35rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                }, title: `Remove ${tag}`, children: _jsx(X, { size: 12 }) })] }, index))), tags.length === 0 && (_jsx("span", { style: { fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }, children: "No items added yet." }))] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder, style: {
                            flex: 1,
                            padding: '0.55rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.9rem',
                            outline: 'none',
                        } }), _jsxs("button", { type: "button", onClick: () => handleAddTag(inputValue), style: {
                            padding: '0.55rem 0.95rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--primary-light)',
                            border: '1px solid var(--border-color-glow)',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.85rem',
                        }, children: [_jsx(Plus, { size: 14 }), _jsx("span", { children: "Add" })] })] }), suggestions.length > 0 && (_jsxs("div", { style: { marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: '0.75rem', color: 'var(--text-dim)' }, children: "Suggestions:" }), suggestions
                        .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
                        .slice(0, 6)
                        .map((sug, idx) => (_jsxs("button", { type: "button", onClick: () => handleAddTag(sug), style: {
                            background: 'var(--bg-surface-elevated)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            borderRadius: 'var(--radius-xs)',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.73rem',
                            cursor: 'pointer',
                        }, children: ["+ ", sug] }, idx)))] }))] }));
};
//# sourceMappingURL=TagInput.js.map