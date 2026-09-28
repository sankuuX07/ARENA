import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowLeft, Download, Trash2, CheckCircle, Wand2 } from 'lucide-react';
export const ResumeDetailsPage = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        const fetchDetails = async () => {
            if (!resumeId)
                return;
            try {
                const data = await resumeService.getResumeDetails(resumeId);
                setResume(data);
            }
            catch (err) {
                console.error(err);
                navigate('/resume/history');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [resumeId, navigate]);
    const handleSetActive = async () => {
        if (!resume || isProcessing)
            return;
        setIsProcessing(true);
        try {
            const updated = await resumeService.setActiveResume(resume.resumeId);
            setResume(updated);
            // Optional: navigate to center to see it active
            navigate('/resume');
        }
        catch (err) {
            console.error(err);
            alert('Failed to set active resume');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleDelete = async () => {
        if (!resume || isProcessing)
            return;
        if (window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
            setIsProcessing(true);
            try {
                await resumeService.deleteResume(resume.resumeId);
                navigate('/resume/history');
            }
            catch (err) {
                console.error(err);
                alert('Failed to delete resume');
            }
            finally {
                setIsProcessing(false);
            }
        }
    };
    const handleDownload = () => {
        if (!resume)
            return;
        const url = resumeService.getDownloadUrl(resume.resumeId);
        window.open(url, '_blank');
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (!resume)
        return _jsx("div", { children: "Resume not found" });
    const formatSize = (bytes) => `${Math.round(bytes / 1024)} KB`;
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Resume Details", icon: _jsx(FileText, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/resume'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back" }) }), _jsxs(Card, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }, children: [_jsxs("div", { children: [_jsx("h2", { style: { margin: '0 0 0.5rem 0' }, children: resume.originalFileName }), resume.isActive ? (_jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 'bold' }, children: [_jsx(CheckCircle, { size: 16 }), " Active Resume"] })) : (_jsx("span", { style: { color: 'var(--text-muted)' }, children: "Inactive" }))] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate(`/resume/${resume.resumeId}/improve`), icon: _jsx(Wand2, { size: 16 }), children: "Improve Resume" }), _jsx(Button, { variant: "outline", onClick: handleDownload, icon: _jsx(Download, { size: 16 }), children: "Download" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: "Upload Date" }), _jsx("div", { style: { fontWeight: 500 }, children: new Date(resume.uploadedAt).toLocaleString() })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: "File Size" }), _jsx("div", { style: { fontWeight: 500 }, children: formatSize(resume.fileSize) })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: "File Type" }), _jsx("div", { style: { fontWeight: 500, textTransform: 'uppercase' }, children: resume.fileExtension })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: "Resume ID" }), _jsx("div", { style: { fontWeight: 500, fontFamily: 'monospace', fontSize: '0.9rem' }, children: resume.resumeId })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }, children: [_jsx(Button, { variant: "outline", style: { borderColor: 'var(--danger)', color: 'var(--danger)' }, onClick: handleDelete, disabled: isProcessing, icon: _jsx(Trash2, { size: 16 }), children: "Delete Resume" }), !resume.isActive && (_jsx(Button, { variant: "primary", onClick: handleSetActive, disabled: isProcessing, icon: _jsx(CheckCircle, { size: 16 }), children: "Set as Active" }))] })] })] }));
};
//# sourceMappingURL=ResumeDetailsPage.js.map