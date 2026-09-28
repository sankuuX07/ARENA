import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
export const NotFoundPage = () => {
    const navigate = useNavigate();
    return (_jsx("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1.5rem',
            minHeight: '60vh',
        }, children: _jsxs(Card, { style: { maxWidth: 500, width: '100%', textAlign: 'center', padding: '3rem 2rem' }, children: [_jsx("div", { style: {
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'var(--error-bg)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--error)',
                        margin: '0 auto 1.5rem auto',
                    }, children: _jsx(ShieldAlert, { size: 36 }) }), _jsx("div", { className: "error-code", style: { fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.2rem' }, children: "404" }), _jsx("h2", { className: "card-title", style: { fontSize: '1.4rem', marginBottom: '0.5rem' }, children: "Page Not Found" }), _jsx("p", { className: "body-text", style: { fontSize: '0.92rem', marginBottom: '2rem', color: 'var(--text-muted)' }, children: "The requested page route does not exist in the ARENA platform. Please check the URL or return to the dashboard." }), _jsxs("div", { style: { display: 'flex', gap: '0.75rem', justifyContent: 'center' }, children: [_jsx(Button, { variant: "secondary", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate(-1), children: "Go Back" }), _jsx(Button, { variant: "primary", icon: _jsx(Home, { size: 16 }), onClick: () => navigate('/dashboard'), children: "Dashboard" })] })] }) }));
};
//# sourceMappingURL=NotFoundPage.js.map