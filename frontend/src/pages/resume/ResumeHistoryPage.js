import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { ResumeCard } from '../../components/resume/ResumeCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { resumeService } from '../../services/resumeService';
import { ResumeListItem } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowLeft, Upload } from 'lucide-react';
export const ResumeHistoryPage = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(null);
    const fetchResumes = async () => {
        try {
            const data = await resumeService.getResumes();
            setResumes(data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchResumes();
    }, []);
    const handleSetActive = async (id) => {
        setIsProcessing(id);
        try {
            await resumeService.setActiveResume(id);
            await fetchResumes(); // Refresh list to show new active status
        }
        catch (err) {
            console.error(err);
            alert('Failed to set active resume');
        }
        finally {
            setIsProcessing(null);
        }
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Resume History", subtitle: "Manage all your uploaded resumes.", icon: _jsx(FileText, { size: 28 }), action: _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate('/resume'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back" }), _jsx(Button, { onClick: () => navigate('/resume/upload'), icon: _jsx(Upload, { size: 16 }), children: "Upload New" })] }) }), resumes.length === 0 ? (_jsx(EmptyState, { icon: _jsx(FileText, { size: 36 }), title: "No resumes found", description: "You haven't uploaded any resumes yet.", action: _jsx(Button, { onClick: () => navigate('/resume/upload'), children: "Upload Resume" }) })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }, children: resumes.map(resume => (_jsx(ResumeCard, { resume: resume, onSetActive: handleSetActive, isSettingActive: isProcessing === resume.resumeId }, resume.resumeId))) }))] }));
};
//# sourceMappingURL=ResumeHistoryPage.js.map