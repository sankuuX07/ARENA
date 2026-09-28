import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Calendar, HardDrive, CheckCircle } from 'lucide-react';
import { ResumeDetail } from '../../types/resume';
import { useNavigate } from 'react-router-dom';
export const ActiveResumeCard = ({ resume }) => {
    const navigate = useNavigate();
    if (!resume) {
        return (_jsxs(Card, { style: { padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-surface-elevated)' }, children: [_jsx(FileText, { size: 48, style: { color: 'var(--text-muted)', margin: '0 auto 1rem auto' } }), _jsx("h3", { style: { marginBottom: '0.5rem' }, children: "No active resume" }), _jsx("p", { style: { color: 'var(--text-muted)', marginBottom: '1.5rem' }, children: "Upload your resume to prepare for future AI screening and improvement." }), _jsx(Button, { onClick: () => navigate('/resume/upload'), children: "Upload Resume" })] }));
    }
    const formatSize = (bytes) => `${Math.round(bytes / 1024)} KB`;
    return (_jsxs(Card, { style: { border: '2px solid var(--primary)', position: 'relative' }, children: [_jsxs("div", { style: {
                    position: 'absolute',
                    top: '-12px',
                    left: '20px',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }, children: [_jsx(CheckCircle, { size: 14 }), " Active Resume"] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1.5rem' }, children: [_jsx("div", { style: { background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }, children: _jsx(FileText, { size: 40, style: { color: 'var(--primary)' } }) }), _jsxs("div", { children: [_jsx("h2", { style: { margin: '0 0 0.5rem 0' }, children: resume.originalFileName }), _jsxs("div", { style: { display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Calendar, { size: 16 }), " Uploaded: ", new Date(resume.uploadedAt).toLocaleDateString()] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(HardDrive, { size: 16 }), " ", formatSize(resume.fileSize)] })] })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [_jsx(Button, { onClick: () => navigate(`/resume/${resume.resumeId}`), children: "View Resume" }), _jsx(Button, { variant: "outline", onClick: () => navigate('/resume/upload'), children: "Replace Resume" })] })] })] }));
};
//# sourceMappingURL=ActiveResumeCard.js.map