import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getCSCoreSubject, CSSubject } from '../../../services/csCoreService';
import { Button } from '../../../components/ui/Button';
export const CSSubjectPage = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (subjectId) {
            getCSCoreSubject(subjectId)
                .then(setSubject)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [subjectId]);
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading Subject..." });
    if (!subject)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Subject not found." });
    return (_jsxs("div", { style: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/technical/cs-core'), style: { marginBottom: '1rem' }, children: "Back to CS Core Subjects" }), _jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: subject.name }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem' }, children: subject.description })] }), _jsx("div", { style: { display: 'grid', gap: '1rem' }, children: subject.topics?.map((topic, idx) => (_jsxs("div", { onClick: () => navigate(`/technical/cs-core/${subject.subjectId}/${topic.topicId}`), style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease-in-out',
                    }, onMouseEnter: (e) => e.currentTarget.style.borderColor = 'var(--primary)', onMouseLeave: (e) => e.currentTarget.style.borderColor = 'var(--border-color)', children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsxs("div", { style: { color: 'var(--text-muted)', fontSize: '1rem', width: '24px' }, children: [idx + 1, "."] }), _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.25rem', fontSize: '1.1rem' }, children: topic.name }), _jsx("p", { style: { margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: topic.description })] })] }), _jsx(ChevronRight, { size: 20, style: { color: 'var(--text-muted)' } })] }, topic.topicId))) })] }));
};
//# sourceMappingURL=CSSubjectPage.js.map