import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sparkles, StopCircle, Clock } from 'lucide-react';
export const SessionHeader = ({ mode, onEndSession, messageCount }) => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTimer = (totalSec) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const getModeLabel = (m) => {
        switch (m) {
            case 'general':
                return 'General Practice';
            case 'fluency':
                return 'Spoken Fluency';
            case 'formal':
                return 'Formal Corporate';
            case 'situational':
                return 'Situational';
            case 'group_discussion':
                return 'Group Discussion';
            default:
                return m;
        }
    };
    return (_jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(Badge, { variant: "primary", icon: _jsx(Sparkles, { size: 13 }), children: getModeLabel(mode) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }, children: [_jsx(Clock, { size: 14 }), _jsx("span", { children: formatTimer(seconds) })] }), _jsxs("span", { style: { fontSize: '0.82rem', color: 'var(--text-dim)' }, children: ["\u2022 ", messageCount, " Messages"] })] }), _jsx(Button, { variant: "secondary", size: "sm", icon: _jsx(StopCircle, { size: 15 }), onClick: onEndSession, children: "End Session" })] }));
};
//# sourceMappingURL=SessionHeader.js.map