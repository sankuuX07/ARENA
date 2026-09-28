import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const CodeEditor = ({ language, value, onChange, readOnly = false, disabled = false }) => {
    return (_jsxs("div", { style: {
            width: '100%',
            height: '100%',
            minHeight: '400px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }, children: [_jsxs("div", { style: {
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }, children: [_jsx("div", { style: { fontWeight: 600, textTransform: 'uppercase' }, children: language }), _jsx("div", { children: "Code Editor" })] }), _jsx("div", { style: { flex: 1, position: 'relative' }, children: _jsx("textarea", { value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, readOnly: readOnly, spellCheck: false, style: {
                        width: '100%',
                        height: '100%',
                        padding: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        resize: 'none',
                        outline: 'none',
                        opacity: disabled ? 0.6 : 1,
                        cursor: disabled ? 'not-allowed' : 'text',
                    } }) })] }));
};
//# sourceMappingURL=CodeEditor.js.map