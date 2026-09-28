import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getStudentRank } from '../services/rankingService';
import { LeaderboardEntry, StudentRankSummary } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Trophy, Award, AlertCircle, RefreshCw, Sparkles, } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn } from '../utils/motion';
export const LeaderboardPage = () => {
    const { currentUser, userProfile } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [studentRankSummary, setStudentRankSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadLeaderboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLeaderboard();
            setLeaderboard(data);
            if (currentUser) {
                const rankSummary = await getStudentRank(currentUser.uid);
                setStudentRankSummary(rankSummary);
            }
        }
        catch (err) {
            setError(err.message || 'Unable to load leaderboard. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadLeaderboardData();
    }, [currentUser]);
    const getInitials = (name) => {
        if (!name)
            return 'ST';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };
    if (loading) {
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Loading competitive leaderboard standings...", size: 22 }) }));
    }
    if (error) {
        return (_jsxs("div", { style: { maxWidth: 500, margin: '3rem auto', textAlign: 'center' }, children: [_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", style: { justifyContent: 'center' }, children: [_jsx(AlertCircle, { size: 20 }), _jsx("span", { className: "error-title", children: "Leaderboard Error" })] }), _jsx("div", { className: "error-message", style: { textAlign: 'center' }, children: error })] }), _jsx(Button, { variant: "primary", icon: _jsx(RefreshCw, { size: 16 }), onClick: loadLeaderboardData, children: "Try Again" })] }));
    }
    const top1 = leaderboard[0];
    const top2 = leaderboard[1];
    const top3 = leaderboard[2];
    const currentStudentRankNum = studentRankSummary?.rank;
    return (_jsxs(motion.div, { style: { maxWidth: 1100, margin: '0 auto', width: '100%' }, variants: staggerContainer, initial: "hidden", animate: "visible", children: [_jsx(motion.div, { variants: fadeIn, children: _jsx(PageHeader, { title: "Competitive Leaderboard", description: "Compete with fellow ARENA students, solve practice challenges, and climb placement readiness ranks.", icon: _jsx(Trophy, { size: 24 }), badge: _jsx(Badge, { variant: "primary", icon: _jsx(Sparkles, { size: 12 }), children: "Deterministic Engine" }) }) }), currentUser && (_jsx(Card, { style: {
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    border: '1.5px solid var(--border-color-glow)',
                }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: {
                                        width: 54,
                                        height: 54,
                                        borderRadius: '50%',
                                        background: 'var(--primary-gradient)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        boxShadow: 'var(--shadow-glow)',
                                    }, children: userProfile?.profilePhotoUrl ? (_jsx("img", { src: userProfile.profilePhotoUrl, alt: userProfile.fullName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(userProfile?.fullName)) }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }, children: [_jsx("h3", { className: "card-title", style: { fontSize: '1.15rem' }, children: userProfile?.fullName || 'Your Position' }), _jsx(Badge, { variant: "primary", children: "You" })] }), _jsx("p", { className: "caption-text", style: { fontSize: '0.85rem' }, children: currentStudentRankNum === 1
                                                ? "You're currently Rank #1! Keep practicing to stay on top."
                                                : currentStudentRankNum
                                                    ? `Ranked #${currentStudentRankNum} among ${studentRankSummary?.totalStudents || 1} students.`
                                                    : 'Start practicing to establish your rank.' })] })] }), _jsxs("div", { style: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("span", { className: "caption-text", style: { fontSize: '0.75rem', display: 'block' }, children: "Current Rank" }), _jsx("span", { style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }, children: studentRankSummary?.rankFormatted || '#--' })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("span", { className: "caption-text", style: { fontSize: '0.75rem', display: 'block' }, children: "Total Score" }), _jsxs("span", { style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }, children: [studentRankSummary?.score || 0, " pts"] })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("span", { className: "caption-text", style: { fontSize: '0.75rem', display: 'block' }, children: "Accuracy" }), _jsxs("span", { style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }, children: [studentRankSummary?.accuracy || 0, "%"] })] })] })] }) })), leaderboard.length > 0 && (_jsxs(motion.div, { style: { marginBottom: '2.5rem' }, variants: staggerItem, children: [_jsx("h2", { className: "section-title", style: { fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }, children: "Top Percentile Champions" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '1.25rem',
                            alignItems: 'end',
                        }, children: [top2 ? (_jsxs(Card, { style: {
                                    padding: '1.5rem 1rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1.5px solid rgba(148, 163, 184, 0.4)',
                                    position: 'relative',
                                }, children: [_jsx("div", { style: { position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }, children: _jsx(Badge, { variant: "neutral", style: { background: '#94a3b8', color: '#0f172a', fontWeight: 800 }, children: "\uD83E\uDD48 Rank #2" }) }), _jsx("div", { style: {
                                            width: 64,
                                            height: 64,
                                            margin: '0.75rem auto 0.6rem',
                                            borderRadius: '50%',
                                            background: '#94a3b8',
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.3rem',
                                            fontWeight: 800,
                                        }, children: top2.profilePhotoUrl ? (_jsx("img", { src: top2.profilePhotoUrl, alt: top2.displayName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(top2.displayName)) }), _jsx("h3", { style: { fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }, children: top2.displayName }), _jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }, children: [top2.score, " pts"] }), _jsxs("div", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }, children: [top2.accuracy, "% Accuracy \u2022 ", top2.problemsSolved, " Solved"] })] })) : null, top1 ? (_jsxs(Card, { style: {
                                    padding: '1.85rem 1rem',
                                    textAlign: 'center',
                                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                                    border: '2px solid rgba(234, 179, 8, 0.6)',
                                    position: 'relative',
                                    boxShadow: 'var(--shadow-glow)',
                                }, children: [_jsx("div", { style: { position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }, children: _jsx(Badge, { variant: "warning", style: { background: '#eab308', color: '#0f172a', fontWeight: 800, padding: '0.3rem 0.75rem' }, children: "\uD83E\uDD47 Rank #1 Champion" }) }), _jsx("div", { style: {
                                            width: 76,
                                            height: 76,
                                            margin: '0.75rem auto 0.6rem',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 800,
                                            boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)',
                                        }, children: top1.profilePhotoUrl ? (_jsx("img", { src: top1.profilePhotoUrl, alt: top1.displayName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(top1.displayName)) }), _jsx("h3", { style: { fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.2rem' }, children: top1.displayName }), _jsxs("div", { style: { fontSize: '1.35rem', fontWeight: 900, color: 'var(--warning)' }, children: [top1.score, " pts"] }), _jsxs("div", { style: { fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }, children: [top1.accuracy, "% Accuracy \u2022 ", top1.problemsSolved, " Solved"] })] })) : null, top3 ? (_jsxs(Card, { style: {
                                    padding: '1.5rem 1rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1.5px solid rgba(217, 119, 6, 0.4)',
                                    position: 'relative',
                                }, children: [_jsx("div", { style: { position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }, children: _jsx(Badge, { variant: "warning", style: { background: '#d97706', color: '#ffffff', fontWeight: 800 }, children: "\uD83E\uDD49 Rank #3" }) }), _jsx("div", { style: {
                                            width: 64,
                                            height: 64,
                                            margin: '0.75rem auto 0.6rem',
                                            borderRadius: '50%',
                                            background: '#d97706',
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.3rem',
                                            fontWeight: 800,
                                        }, children: top3.profilePhotoUrl ? (_jsx("img", { src: top3.profilePhotoUrl, alt: top3.displayName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(top3.displayName)) }), _jsx("h3", { style: { fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }, children: top3.displayName }), _jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }, children: [top3.score, " pts"] }), _jsxs("div", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }, children: [top3.accuracy, "% Accuracy \u2022 ", top3.problemsSolved, " Solved"] })] })) : null] })] })), _jsx(motion.div, { variants: staggerItem, children: _jsxs(Card, { children: [_jsxs("div", { className: "arena-card-header", style: { marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Award, { size: 20, style: { color: 'var(--primary)' } }), _jsx("h2", { className: "card-title", children: "All Student Standings" })] }), _jsxs(Badge, { variant: "neutral", children: [leaderboard.length, " Students"] })] }), leaderboard.length === 0 ? (_jsx(EmptyState, { title: "No rankings available yet", description: "Start practicing to establish your position on the ARENA leaderboard.", icon: _jsx(Trophy, { size: 32 }) })) : (_jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }, children: [_jsx("th", { style: { padding: '0.75rem 1rem', width: 70 }, children: "Rank" }), _jsx("th", { style: { padding: '0.75rem 1rem' }, children: "Student" }), _jsx("th", { style: { padding: '0.75rem 1rem', width: 110 }, children: "Score" }), _jsx("th", { style: { padding: '0.75rem 1rem', width: 100 }, children: "Accuracy" }), _jsx("th", { style: { padding: '0.75rem 1rem', width: 110 }, children: "Solved" }), _jsx("th", { style: { padding: '0.75rem 1rem', width: 90, textAlign: 'center' }, children: "Change" })] }) }), _jsx("tbody", { children: leaderboard.map((entry) => {
                                            const isCurrent = currentUser && currentUser.uid === entry.uid;
                                            return (_jsxs(motion.tr, { variants: staggerItem, style: {
                                                    borderBottom: '1px solid var(--border-color)',
                                                    background: isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                                    fontWeight: isCurrent ? 600 : 400,
                                                }, children: [_jsx("td", { style: { padding: '0.85rem 1rem' }, children: _jsx("div", { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }, children: entry.rank === 1 ? (_jsx(Badge, { variant: "warning", children: "#1" })) : entry.rank === 2 ? (_jsx(Badge, { variant: "neutral", children: "#2" })) : entry.rank === 3 ? (_jsx(Badge, { variant: "warning", style: { background: '#d97706', color: '#fff' }, children: "#3" })) : (_jsxs("span", { style: { fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }, children: ["#", entry.rank] })) }) }), _jsx("td", { style: { padding: '0.85rem 1rem' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("div", { style: {
                                                                        width: 34,
                                                                        height: 34,
                                                                        borderRadius: '50%',
                                                                        background: 'var(--primary-gradient)',
                                                                        color: '#fff',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: '0.82rem',
                                                                        fontWeight: 700,
                                                                    }, children: entry.profilePhotoUrl ? (_jsx("img", { src: entry.profilePhotoUrl, alt: entry.displayName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(entry.displayName)) }), _jsxs("div", { children: [_jsx("span", { style: { color: 'var(--text-main)', fontSize: '0.92rem' }, children: entry.displayName }), isCurrent && (_jsx(Badge, { variant: "primary", style: { marginLeft: '0.5rem', fontSize: '0.65rem' }, children: "You" }))] })] }) }), _jsxs("td", { style: { padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }, children: [entry.score, " pts"] }), _jsxs("td", { style: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--success)' }, children: [entry.accuracy, "%"] }), _jsx("td", { style: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }, children: entry.problemsSolved }), _jsx("td", { style: { padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)' }, children: "\u2014" })] }, entry.uid));
                                        }) })] }) }))] }) })] }));
};
//# sourceMappingURL=LeaderboardPage.js.map