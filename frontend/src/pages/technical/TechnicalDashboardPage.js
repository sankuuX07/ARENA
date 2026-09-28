import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';
import { getTechnicalModules, TechnicalModule } from '../../services/technicalService';
import { getProgressSummary } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
export const TechnicalDashboardPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [mods, progSummary] = await Promise.all([
                getTechnicalModules(),
                getProgressSummary(currentUser.uid)
            ]);
            setModules(mods);
            const technicalProg = progSummary.moduleProgress['technical']?.progressPercentage || 0;
            setProgress(technicalProg);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading modules..." });
    return (_jsxs("div", { style: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }, children: [_jsx("div", { style: { padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '12px' }, children: _jsx(Code2, { size: 32 }) }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '2rem', margin: 0 }, children: "ARENA Technical Preparation" }), _jsx("p", { style: { color: 'var(--text-secondary)', margin: '0.5rem 0 0' }, children: "Learn. Practice. Master. Get Placement Ready." })] })] }), _jsxs("div", { style: { marginBottom: '3rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'inline-block' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Overall Progress:" }), _jsxs("strong", { style: { marginLeft: '0.5rem', color: 'var(--primary)' }, children: [progress, "%"] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }, children: modules.map((mod) => (_jsxs("div", { style: {
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        opacity: mod.status === 'coming_soon' ? 0.6 : 1
                    }, children: [_jsx("h2", { style: { margin: '0 0 0.5rem', fontSize: '1.5rem' }, children: mod.title }), _jsx("p", { style: { color: 'var(--text-secondary)', flex: 1, marginBottom: '1.5rem' }, children: mod.description }), mod.status === 'coming_soon' ? (_jsx(Button, { variant: "outline", disabled: true, fullWidth: true, children: "Coming Soon" })) : (_jsx(Button, { variant: "primary", icon: _jsx(ArrowRight, { size: 16 }), fullWidth: true, onClick: () => navigate(`/technical/${mod.language}`), children: "Explore" }))] }, mod.moduleId))) })] }));
};
//# sourceMappingURL=TechnicalDashboardPage.js.map