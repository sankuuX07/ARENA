import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Button } from '../../ui/Button';
export const ResumeSuggestionEditor = ({ initialText, onSave, onCancel, isSaving }) => {
    const [text, setText] = useState(initialText);
    return (_jsxs("div", { style: { marginTop: '1rem', marginBottom: '1rem' }, children: [_jsx("div", { style: { fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }, children: "Edit Suggestion" }), _jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), style: {
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--primary)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                } }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outline", onClick: onCancel, disabled: isSaving, children: "Cancel" }), _jsx(Button, { onClick: () => onSave(text), disabled: isSaving || !text.trim(), children: "Save Changes" })] })] }));
};
//# sourceMappingURL=ResumeSuggestionEditor.js.map