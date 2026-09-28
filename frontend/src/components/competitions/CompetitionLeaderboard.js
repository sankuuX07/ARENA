import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { CompetitionLeaderboardEntry } from '../../types/competition';
import { Trophy } from 'lucide-react';
export const CompetitionLeaderboard = ({ entries, currentUserId }) => {
    if (!entries || entries.length === 0) {
        return (_jsxs(Card, { style: { textAlign: 'center', padding: '3rem' }, children: [_jsx(Trophy, { size: 48, style: { color: 'var(--border-color)', marginBottom: '1rem' } }), _jsx("h3", { style: { color: 'var(--text-secondary)' }, children: "Leaderboard is empty" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Check back later once results are calculated." })] }));
    }
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };
    return (_jsx(Card, { style: { padding: 0, overflow: 'hidden' }, children: _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: 'var(--bg-main)', borderBottom: '2px solid var(--border-color)' }, children: [_jsx("th", { style: { padding: '1rem', fontWeight: 'bold' }, children: "Rank" }), _jsx("th", { style: { padding: '1rem', fontWeight: 'bold' }, children: "Participant" }), _jsx("th", { style: { padding: '1rem', fontWeight: 'bold' }, children: "Score" }), _jsx("th", { style: { padding: '1rem', fontWeight: 'bold' }, children: "Completed" }), _jsx("th", { style: { padding: '1rem', fontWeight: 'bold' }, children: "Time Used" })] }) }), _jsx("tbody", { children: entries.map((entry) => {
                            const isCurrentUser = entry.userId === currentUserId;
                            return (_jsxs("tr", { style: {
                                    borderBottom: '1px solid var(--border-color)',
                                    background: isCurrentUser ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                    fontWeight: isCurrentUser ? 'bold' : 'normal'
                                }, children: [_jsx("td", { style: { padding: '1rem' }, children: entry.rank === 1 ? _jsx("span", { style: { color: '#ffd700' }, children: "\uD83E\uDD47 1" }) :
                                            entry.rank === 2 ? _jsx("span", { style: { color: '#c0c0c0' }, children: "\uD83E\uDD48 2" }) :
                                                entry.rank === 3 ? _jsx("span", { style: { color: '#cd7f32' }, children: "\uD83E\uDD49 3" }) :
                                                    entry.rank }), _jsxs("td", { style: { padding: '1rem' }, children: [entry.displayName, " ", isCurrentUser && _jsx("span", { style: { fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem' }, children: "(You)" })] }), _jsx("td", { style: { padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }, children: entry.score }), _jsx("td", { style: { padding: '1rem', color: 'var(--text-secondary)' }, children: entry.challengesCompleted }), _jsx("td", { style: { padding: '1rem', color: 'var(--text-secondary)' }, children: formatTime(entry.timeUsedSeconds) })] }, entry.userId));
                        }) })] }) }) }));
};
//# sourceMappingURL=CompetitionLeaderboard.js.map