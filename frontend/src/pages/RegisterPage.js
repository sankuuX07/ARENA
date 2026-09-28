import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../services/authService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shield, User as UserIcon, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '../utils/motion';
import { AuthBackground3D } from '../components/3d/AuthBackground3D';
export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [serverError, setServerError] = useState('');
    const validateForm = () => {
        setValidationError('');
        setServerError('');
        if (!fullName.trim()) {
            setValidationError('Full name is required.');
            return false;
        }
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
        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setValidationError('Passwords do not match.');
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
            await register({ fullName, email, password });
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
        }, children: [_jsx(AuthBackground3D, {}), _jsx(motion.div, { variants: slideUp, initial: "hidden", animate: "visible", style: { width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }, children: _jsxs(Card, { style: { padding: '2.5rem 2rem' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '1.75rem' }, children: [_jsx("div", { style: {
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
                                    }, children: _jsx(Shield, { size: 30 }) }), _jsx(Badge, { variant: "primary", style: { marginBottom: '0.5rem' }, children: "ARENA Student Registration" }), _jsx("h1", { className: "section-title", style: { fontSize: '1.8rem', fontWeight: 800 }, children: "Create Your Account" }), _jsx("p", { className: "caption-text", style: { fontSize: '0.9rem' }, children: "Join ARENA to start your placement preparation journey." })] }), (validationError || serverError) && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Registration Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: validationError || serverError })] })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1.15rem' }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "register-fullname", style: {
                                                display: 'block',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                marginBottom: '0.4rem',
                                                color: 'var(--text-main)',
                                            }, children: "Full Name" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(UserIcon, { size: 18, style: {
                                                        position: 'absolute',
                                                        left: '0.85rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--text-muted)',
                                                    } }), _jsx("input", { id: "register-fullname", type: "text", placeholder: "John Doe", value: fullName, onChange: (e) => setFullName(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "register-email", style: {
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
                                                    } }), _jsx("input", { id: "register-email", type: "email", placeholder: "student@example.com", value: email, onChange: (e) => setEmail(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "register-password", style: {
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
                                                    } }), _jsx("input", { id: "register-password", type: "password", placeholder: "At least 6 characters", value: password, onChange: (e) => setPassword(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "register-confirm-password", style: {
                                                display: 'block',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                marginBottom: '0.4rem',
                                                color: 'var(--text-main)',
                                            }, children: "Confirm Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 18, style: {
                                                        position: 'absolute',
                                                        left: '0.85rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--text-muted)',
                                                    } }), _jsx("input", { id: "register-confirm-password", type: "password", placeholder: "Re-enter password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), style: {
                                                        width: '100%',
                                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--bg-input)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--text-main)',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                    } })] })] }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", loading: loading, fullWidth: true, icon: _jsx(UserPlus, { size: 18 }), iconPosition: "right", children: "Create Account" })] }), _jsxs("div", { style: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }, children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", style: { color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }, children: "Login" })] })] }) })] }));
};
//# sourceMappingURL=RegisterPage.js.map