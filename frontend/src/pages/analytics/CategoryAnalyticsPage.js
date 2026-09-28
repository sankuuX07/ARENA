import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { analyticsService } from '../../services/analyticsService';
import { ArrowLeft, Activity } from 'lucide-react';
export const CategoryAnalyticsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId)
                return;
            try {
                let result;
                switch (categoryId) {
                    case 'communication':
                        result = await analyticsService.getCommunicationAnalytics();
                        break;
                    case 'aptitude':
                        result = await analyticsService.getAptitudeAnalytics();
                        break;
                    case 'coding':
                        result = await analyticsService.getCodingAnalytics();
                        break;
                    case 'technical':
                        result = await analyticsService.getTechnicalAnalytics();
                        break;
                    case 'assessments':
                        result = await analyticsService.getAssessmentAnalytics();
                        break;
                    case 'interviews':
                        result = await analyticsService.getInterviewAnalytics();
                        break;
                    case 'resume':
                        result = await analyticsService.getResumeAnalytics();
                        break;
                    default: throw new Error("Unknown category");
                }
                setData(result);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [categoryId]);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (!data) {
        return (_jsxs("div", { className: "page-container", style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Category Not Found" }), _jsx(Button, { onClick: () => navigate('/analytics'), children: "Back to Analytics" })] }));
    }
    const formatTitle = (id) => {
        return id.charAt(0).toUpperCase() + id.slice(1) + ' Analytics';
    };
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: formatTitle(categoryId || ''), subtitle: `Detailed performance breakdown for ${categoryId}.`, icon: _jsx(Activity, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/analytics'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Overview" }) }), _jsxs(Card, { style: { marginBottom: '2rem' }, children: [_jsx("h3", { style: { marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }, children: "Performance Breakdown" }), data.overallScore === null ? (_jsx("div", { style: { textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }, children: "No data available yet. Start practicing to generate analytics." })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }, children: Object.entries(data).map(([key, value]) => {
                            // Simple formatting for keys like 'fluencyScore' -> 'Fluency Score'
                            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            if (Array.isArray(value))
                                return null; // Skip complex nested arrays for basic view
                            return (_jsxs("div", { style: { background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }, children: formattedKey }), _jsx("div", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }, children: value !== null ? String(value) : 'N/A' })] }, key));
                        }) }))] }), data.languages && data.languages.length > 0 && (_jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1.5rem' }, children: "Language Breakdown" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: data.languages.map((lang, idx) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: [_jsx("span", { style: { fontWeight: 'bold' }, children: lang.language }), _jsxs("span", { style: { color: 'var(--text-secondary)' }, children: [lang.problemsSolved, " Solved (", lang.successRate, "% Success)"] })] }, idx))) })] }))] }));
};
//# sourceMappingURL=CategoryAnalyticsPage.js.map