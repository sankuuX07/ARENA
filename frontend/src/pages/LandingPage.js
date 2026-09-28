import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_TAGLINE } from '../constants';
import { HealthStatus } from '../components/HealthStatus';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Sparkles, MessageSquare, Brain, Code2, BookOpen, ClipboardCheck, Video, FileText, Compass, Trophy, } from 'lucide-react';
export const LandingPage = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/dashboard');
    };
    const handleExplore = () => {
        const el = document.getElementById('features-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const featureCards = [
        {
            icon: _jsx(MessageSquare, { size: 24 }),
            title: 'AI Communication',
            description: 'Improve spoken fluency, formal tone, situational expression, and group discussion confidence.',
            tags: ['Speech Coaching', 'GD Practice', 'Fluency Analysis'],
            path: '/communication',
        },
        {
            icon: _jsx(Brain, { size: 24 }),
            title: 'Aptitude Practice',
            description: 'Master quantitative math, logical reasoning, and verbal aptitude with targeted practice sets.',
            tags: ['Quant Math', 'Logical Reasoning', 'Verbal Skills'],
            path: '/aptitude',
        },
        {
            icon: _jsx(Code2, { size: 24 }),
            title: 'Problem Solving',
            description: 'Practice coding challenges, data structures, and algorithmic problems for tech rounds.',
            tags: ['Data Structures', 'Algorithms', 'Code Execution'],
            path: '/technical',
        },
        {
            icon: _jsx(BookOpen, { size: 24 }),
            title: 'Technical Preparation',
            description: 'Prepare across core CS subjects including OS, DBMS, Computer Networks, and System Design.',
            tags: ['OS & DBMS', 'Networking', 'CS Fundamentals'],
            path: '/technical',
        },
        {
            icon: _jsx(ClipboardCheck, { size: 24 }),
            title: 'Placement Assessments',
            description: 'Simulate full company hiring tests with timed sections and automated evaluation.',
            tags: ['Timed Tests', 'Company Patterns', 'Diagnostic Report'],
            path: '/assessments',
        },
        {
            icon: _jsx(Video, { size: 24 }),
            title: 'AI Mock Interview',
            description: 'Participate in realistic video/voice interview simulations with dynamic follow-up questions.',
            tags: ['Voice & Video', 'Behavioral Rounds', 'Instant Feedback'],
            path: '/mock-interview',
        },
        {
            icon: _jsx(FileText, { size: 24 }),
            title: 'Resume Screening',
            description: 'Analyze your resume against ATS criteria, job descriptions, and industry benchmarks.',
            tags: ['ATS Analysis', 'Keyword Matching', 'Score Optimization'],
            path: '/resume',
        },
    ];
    return (_jsxs("div", { className: "landing-page-container", children: [_jsxs("section", { className: "landing-hero", children: [_jsxs("div", { className: "landing-hero-pill", children: [_jsx(Sparkles, { size: 14 }), _jsx("span", { children: "ARENA UI/UX Foundation Active" })] }), _jsxs("h1", { className: "landing-title", children: ["Master Your Placement Journey with ", _jsx("span", { className: "text-gradient", children: "ARENA" })] }), _jsx("p", { className: "landing-tagline", children: APP_TAGLINE }), _jsx("p", { className: "landing-desc", children: "ARENA is a unified student competitive learning and placement-preparation platform designed to integrate coding practice, aptitude drills, AI communication, mock interviews, and resume analytics into a single seamless ecosystem." }), _jsxs("div", { className: "landing-actions", children: [_jsx(Button, { variant: "primary", size: "lg", icon: _jsx(ArrowRight, { size: 18 }), iconPosition: "right", onClick: handleGetStarted, children: "Get Started" }), _jsx(Button, { variant: "secondary", size: "lg", icon: _jsx(Compass, { size: 18 }), onClick: handleExplore, children: "Explore ARENA" })] }), _jsx("div", { style: { maxWidth: 850, width: '100%', margin: '0 auto' }, children: _jsxs(Card, { hoverLift: true, style: { padding: '1.5rem', background: 'var(--bg-surface-elevated)', textAlign: 'left' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }, children: [_jsx(Trophy, { size: 18, style: { color: 'var(--primary)' } }), _jsx("span", { children: "Placement Readiness Ecosystem" })] }), _jsx(Badge, { variant: "success", children: "Milestone 2 Verified" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }, children: [_jsxs("div", { style: { background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { fontSize: '0.75rem', color: 'var(--text-muted)' }, children: "Student Cohorts" }), _jsx("div", { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }, children: "Competitive" })] }), _jsxs("div", { style: { background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { fontSize: '0.75rem', color: 'var(--text-muted)' }, children: "Prep Modules" }), _jsx("div", { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }, children: "7 Modules" })] }), _jsxs("div", { style: { background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { fontSize: '0.75rem', color: 'var(--text-muted)' }, children: "AI Assistance" }), _jsx("div", { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }, children: "Intelligent" })] })] })] }) })] }), _jsxs("section", { id: "features-section", className: "features-section", children: [_jsxs("div", { className: "section-header-center", children: [_jsx("h2", { className: "section-title", style: { fontSize: '2.1rem', marginBottom: '0.5rem' }, children: "Comprehensive Placement Preparation" }), _jsx("p", { className: "body-text", children: "Everything you need to excel in campus placements and technical recruitment in one platform." })] }), _jsx("div", { className: "feature-cards-grid", children: featureCards.map((card, idx) => (_jsxs(Card, { hoverLift: true, className: "feature-card", onClick: () => navigate(card.path), style: { cursor: 'pointer' }, children: [_jsx("div", { className: "feature-card-icon", children: card.icon }), _jsx("h3", { className: "card-title", style: { fontSize: '1.15rem', marginBottom: '0.4rem' }, children: card.title }), _jsx("p", { className: "body-text", style: { fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }, children: card.description }), _jsx("div", { className: "feature-tag-list", children: card.tags.map((tag, tIdx) => (_jsx("span", { className: "feature-tag", children: tag }, tIdx))) })] }, idx))) })] }), _jsx("section", { style: { padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: 650, margin: '0 auto' }, children: _jsx(HealthStatus, {}) })] }));
};
//# sourceMappingURL=LandingPage.js.map