import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Upload, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';
export const ResumeWidget = () => {
    const navigate = useNavigate();
    const [activeResume, setActiveResume] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchActive = async () => {
            try {
                const resume = await resumeService.getActiveResume();
                setActiveResume(resume);
            }
            catch (err) {
                console.error('Failed to load active resume for widget', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchActive();
    }, []);
    if (loading)
        return null;
    return (_jsx(Card, { style: { marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)' }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }, children: _jsx(FileText, { size: 24, style: { color: 'var(--primary)' } }) }), _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.25rem 0', fontSize: '1.1rem' }, children: "Resume" }), activeResume ? (_jsxs("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: activeResume.originalFileName }), _jsx("span", { style: { margin: '0 0.5rem' }, children: "\u2022" }), _jsx("span", { style: { color: 'var(--success)' }, children: "Ready" })] })) : (_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: "Upload your resume to prepare for screening." }))] })] }), _jsx("div", { children: activeResume ? (_jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate('/resume/improve'), icon: _jsx(Wand2, { size: 16 }), children: "Improve" }), _jsx(Button, { variant: "outline", onClick: () => navigate('/resume'), children: "Manage" })] })) : (_jsx(Button, { onClick: () => navigate('/resume/upload'), icon: _jsx(Upload, { size: 16 }), children: "Upload Resume" })) })] }) }));
};
//# sourceMappingURL=ResumeWidget.js.map