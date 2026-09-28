import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ResumeUploadZone = ({ onUpload, isLoading, progress }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const validateFile = (file) => {
        setError(null);
        if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
            setError("Please select a PDF or DOCX file.");
            return false;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
            return false;
        }
        return true;
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };
    const handleUploadClick = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        }
    };
    return (_jsx(Card, { style: { padding: '2rem', textAlign: 'center' }, children: !selectedFile ? (_jsxs("div", { onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, style: {
                border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-surface-elevated)',
                transition: 'all 0.2s ease',
                position: 'relative'
            }, children: [_jsx("input", { type: "file", accept: ".pdf,.docx", onChange: handleChange, style: {
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        opacity: 0,
                        cursor: 'pointer'
                    } }), _jsx(UploadCloud, { size: 48, style: { color: dragActive ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '1rem' } }), _jsx("h3", { style: { marginBottom: '0.5rem' }, children: "Upload Your Resume" }), _jsxs("p", { style: { color: 'var(--text-muted)', marginBottom: '1rem' }, children: ["PDF or DOCX. Maximum file size: ", MAX_SIZE_MB, " MB"] }), _jsx("div", { style: { color: 'var(--primary)', fontWeight: 'bold' }, children: "Drop resume here or Click to Choose" }), error && _jsx("div", { style: { color: 'var(--danger)', marginTop: '1rem', fontWeight: 500 }, children: error })] })) : (_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsx(FileText, { size: 32, style: { color: 'var(--primary)' } }), _jsxs("div", { style: { textAlign: 'left' }, children: [_jsx("div", { style: { fontWeight: 'bold', fontSize: '1.1rem' }, children: selectedFile.name }), _jsxs("div", { style: { color: 'var(--text-muted)', fontSize: '0.9rem' }, children: [(selectedFile.size / 1024).toFixed(0), " KB"] })] }), !isLoading && (_jsx("button", { onClick: () => setSelectedFile(null), style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '1rem' }, children: _jsx(X, { size: 20 }) }))] }), isLoading ? (_jsxs("div", { style: { width: '100%', maxWidth: '300px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: [_jsx("span", { children: "Uploading..." }), _jsxs("span", { children: [progress || 0, "%"] })] }), _jsx("div", { style: { height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }, children: _jsx("div", { style: {
                                    height: '100%',
                                    width: `${progress || 0}%`,
                                    background: 'var(--primary)',
                                    transition: 'width 0.2s ease'
                                } }) })] })) : (_jsx(Button, { onClick: handleUploadClick, fullWidth: true, style: { maxWidth: '300px' }, children: "Upload Resume" }))] })) }));
};
//# sourceMappingURL=ResumeUploadZone.js.map