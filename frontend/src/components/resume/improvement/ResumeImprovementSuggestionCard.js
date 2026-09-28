import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ResumeBeforeAfterComparison } from './ResumeBeforeAfterComparison';
import { ResumeSuggestionEditor } from './ResumeSuggestionEditor';
import { ResumeImprovementSuggestion } from '../../../types/resumeImprovement';
import { CheckCircle, XCircle, Edit3, Lightbulb } from 'lucide-react';
export const ResumeImprovementSuggestionCard = ({ suggestion, onAccept, onReject, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const handleAccept = async () => {
        setIsProcessing(true);
        await onAccept(suggestion.suggestionId);
        setIsProcessing(false);
    };
    const handleReject = async () => {
        setIsProcessing(true);
        await onReject(suggestion.suggestionId);
        setIsProcessing(false);
    };
    const handleEditSave = async (text) => {
        setIsProcessing(true);
        await onEdit(suggestion.suggestionId, text);
        setIsEditing(false);
        setIsProcessing(false);
    };
    const getPriorityColor = () => {
        if (suggestion.priority === 'high')
            return 'var(--danger)';
        if (suggestion.priority === 'medium')
            return 'var(--warning)';
        return 'var(--primary)';
    };
    return (_jsxs(Card, { style: { marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }, children: [_jsx("div", { style: { position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getPriorityColor() } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '0.5rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', color: getPriorityColor(), marginBottom: '0.5rem', textTransform: 'uppercase' }, children: suggestion.section }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }, children: [_jsx(Lightbulb, { size: 18, style: { color: 'var(--warning)', marginTop: '2px' } }), _jsx("p", { style: { margin: 0, fontStyle: 'italic', fontSize: '0.95rem' }, children: suggestion.reason })] })] }), suggestion.status !== 'pending' && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: suggestion.status === 'accepted' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }, children: [suggestion.status === 'accepted' ? _jsx(CheckCircle, { size: 16 }) : _jsx(XCircle, { size: 16 }), suggestion.status] }))] }), isEditing ? (_jsx(ResumeSuggestionEditor, { initialText: suggestion.suggestedText, onSave: handleEditSave, onCancel: () => setIsEditing(false), isSaving: isProcessing })) : (_jsx(ResumeBeforeAfterComparison, { originalText: suggestion.originalText, suggestedText: suggestion.suggestedText })), suggestion.status === 'pending' && !isEditing && (_jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }, children: [_jsx(Button, { variant: "ghost", onClick: handleReject, disabled: isProcessing, icon: _jsx(XCircle, { size: 16 }), children: "Reject" }), _jsx(Button, { variant: "outline", onClick: () => setIsEditing(true), disabled: isProcessing, icon: _jsx(Edit3, { size: 16 }), children: "Edit Draft" }), _jsx(Button, { variant: "primary", onClick: handleAccept, disabled: isProcessing, icon: _jsx(CheckCircle, { size: 16 }), children: "Accept Suggestion" })] }))] }));
};
//# sourceMappingURL=ResumeImprovementSuggestionCard.js.map