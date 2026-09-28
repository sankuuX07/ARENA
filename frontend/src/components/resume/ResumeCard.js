import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { ResumeListItem } from '../../types/resume';
import { useNavigate } from 'react-router-dom';
export const ResumeCard = ({ resume, onSetActive, isSettingActive }) => {
    const navigate = useNavigate();
    const formatSize = (bytes) => `${Math.round(bytes / 1024)} KB`;
    return (_jsxs(Card, { style: { display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsx("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: { background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }, children: _jsx(FileText, { size: 24, style: { color: 'var(--primary)' } }) }), _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.25rem 0', fontSize: '1.1rem', wordBreak: 'break-all' }, children: resume.originalFileName }), resume.isActive && (_jsx("span", { style: {
                                        background: 'var(--success)',
                                        color: 'white',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }, children: "Active" }))] })] }) }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Calendar, { size: 16 }), " Uploaded: ", new Date(resume.uploadedAt).toLocaleDateString()] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(HardDrive, { size: 16 }), " Size: ", formatSize(resume.fileSize)] })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginTop: 'auto' }, children: [_jsx(Button, { variant: "outline", fullWidth: true, onClick: () => navigate(`/resume/${resume.resumeId}`), children: "View Details" }), !resume.isActive && onSetActive && (_jsx(Button, { variant: "primary", fullWidth: true, onClick: () => onSetActive(resume.resumeId), disabled: isSettingActive, children: "Set Active" }))] })] }));
};
//# sourceMappingURL=ResumeCard.js.map