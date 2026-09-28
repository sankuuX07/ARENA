import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../services/authService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shield, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '../utils/motion';
import { AuthBackground3D } from '../components/3d/AuthBackground3D';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [serverError, setServerError] = useState('');
    const validateForm = () => {
        setValidationError('');
        setServerError('');
        if (!email.trim()) {
            setValidationError('Email is required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setValidationError('Please enter a valid email address.');
            return false;
        }
        if (!password) {
            setValidationError('Password is required.');
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        }
        catch (err) {
            setServerError(getFriendlyErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3.5rem 1.5rem',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }, children: [_jsx(AuthBackground3D, {}), _jsx(motion.div, { variants: slideUp, initial: "hidden", animate: "visible", style: { width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }, children: _jsxs(Card, { style: { padding: '2.5rem 2rem' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '2rem' }, children: [_jsx("div", { style: {
                                        width: 54,
                                        height: 54,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--primary-gradient)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        margin: '0 auto 1rem auto',
                                        boxShadow: 'var(--shadow-glow)',
                                    }, children: _jsx(Shield, { size: 30 }) }), _jsx(Badge, { variant: "primary", style: { marginBottom: '0.5rem' }, children: "ARENA Platform" }), _jsx("h1", { className: "section-title", style: { fontSize: '1.8rem', fontWeight: 800 }, children: "Welcome Back" }), _jsx("p", { className: "caption-text", style: { fontSize: '0.9rem' }, children: "Log in to access your competitive placement dashboard." })] }), (validationError || serverError) && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Authentication Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: validationError || serverError })] })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1.25rem' }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "login-email", style: {
                                                display: 'block',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                marginBottom: '0.4rem',
                                                color: 'var(--text-main)',
                                            }, children: "Email Address" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Mail, { size: 18, style: {
                                                        position: 'absolute',
                                                        left: '0.85rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--text-muted)',
                                                    } }), _jsx("input", { id: "login-email", type: "email", placeholder: "student@example.com", value: email, onChange: (e) => setEmail(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "login-password", style: {
                                                display: 'block',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                marginBottom: '0.4rem',
                                                color: 'var(--text-main)',
                                            }, children: "Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 18, style: {
                                                        position: 'absolute',
                                                        left: '0.85rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--text-muted)',
                                                    } }), _jsx("input", { id: "login-password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", loading: loading, fullWidth: true, icon: _jsx(LogIn, { size: 18 }), iconPosition: "right", children: "Login" })] }), _jsxs("div", { style: { textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }, children: ["Don't have an account? ", _jsx(Link, { to: "/register", style: { color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }, children: "Create Account" })] })] }) })] }));
};
//# sourceMappingURL=LoginPage.js.map