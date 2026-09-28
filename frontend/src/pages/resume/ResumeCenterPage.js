import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { FileText, Upload } from 'lucide-react';
import { ActiveResumeCard } from '../../components/resume/ActiveResumeCard';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';
export const ResumeCenterPage = () => {
    const navigate = useNavigate();
    const [activeResume, setActiveResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchActive = async () => {
            try {
                const resume = await resumeService.getActiveResume();
                setActiveResume(resume);
            }
            catch (err) {
                console.error('Failed to load active resume', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchActive();
    }, []);
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Loading Resume Center..." }) }));
    }
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Resume Center", subtitle: "Upload and manage your resume for future screening and improvement.", icon: _jsx(FileText, { size: 28 }), action: _jsx(Button, { onClick: () => navigate('/resume/upload'), icon: _jsx(Upload, { size: 16 }), children: "Upload Resume" }) }), _jsx("div", { style: { marginBottom: '2rem' }, children: _jsx(ActiveResumeCard, { resume: activeResume }) }), _jsx("div", { style: { display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }, children: _jsx(Button, { variant: "outline", onClick: () => navigate('/resume/history'), children: "Manage Resume History" }) })] }));
};
//# sourceMappingURL=ResumeCenterPage.js.map