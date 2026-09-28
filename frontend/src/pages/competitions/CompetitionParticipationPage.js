import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionTimer } from '../../components/competitions/CompetitionTimer';
import { competitionService } from '../../services/competitionService';
import { CompetitionSession, Competition } from '../../types/competition';
import { Save, Send } from 'lucide-react';
export const CompetitionParticipationPage = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [session, setSession] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const saveTimeoutRef = useRef(null);
    useEffect(() => {
        const initSession = async () => {
            if (!competitionId)
                return;
            try {
                const comp = await competitionService.getById(competitionId);
                setCompetition(comp);
                let activeSession;
                try {
                    activeSession = await competitionService.start(competitionId);
                }
                catch (e) {
                    // If we can't start, try to get existing (might already be started)
                    activeSession = await competitionService.getSession(competitionId);
                }
                if (activeSession.status !== 'active') {
                    navigate(`/competitions/${competitionId}/result`);
                    return;
                }
                setSession(activeSession);
                setAnswers(activeSession.answers || {});
            }
            catch (err) {
                setError(err.message || "Failed to initialize session");
            }
            finally {
                setIsLoading(false);
            }
        };
        initSession();
    }, [competitionId, navigate]);
    const handleAnswerChange = (challengeId, answer) => {
        const newAnswers = { ...answers, [challengeId]: answer };
        setAnswers(newAnswers);
        // Debounce save
        if (saveTimeoutRef.current)
            clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            saveAnswers(newAnswers);
        }, 2000);
    };
    const saveAnswers = async (currentAnswers) => {
        if (!competitionId)
            return;
        setIsSaving(true);
        try {
            await competitionService.updateSession(competitionId, currentAnswers);
        }
        catch (e) {
            console.error("Autosave failed", e);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleSubmit = async () => {
        if (!competitionId || !session)
            return;
        const uncompleted = competition?.challenges.length || 0 - Object.keys(answers).length;
        if (uncompleted > 0) {
            if (!window.confirm(`You have unanswered questions. Submit anyway?`))
                return;
        }
        setIsSubmitting(true);
        try {
            await competitionService.submit(competitionId);
            navigate(`/competitions/${competitionId}/result`);
        }
        catch (err) {
            alert(err.message || "Submission failed");
            setIsSubmitting(false);
        }
    };
    const handleExpire = async () => {
        if (!competitionId)
            return;
        alert("Time is up! Submitting automatically.");
        setIsSubmitting(true);
        try {
            await competitionService.submit(competitionId);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            navigate(`/competitions/${competitionId}/result`);
        }
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error || !competition || !session)
        return _jsxs("div", { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: error })] });
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)' }, children: [_jsxs("div", { style: { padding: '1rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: '1.2rem', margin: 0 }, children: competition.title }), _jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: [competition.type.toUpperCase(), " COMPETITION"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: isSaving ? 'var(--warning)' : 'var(--success)', fontSize: '0.9rem' }, children: [_jsx(Save, { size: 16 }), isSaving ? 'Saving...' : 'Saved'] }), _jsx(CompetitionTimer, { expiresAt: session.expiresAt, onExpire: handleExpire }), _jsx(Button, { onClick: handleSubmit, disabled: isSubmitting, icon: _jsx(Send, { size: 16 }), children: isSubmitting ? 'Submitting...' : 'Submit' })] })] }), _jsx("div", { style: { flex: 1, overflowY: 'auto', padding: '2rem' }, children: _jsxs("div", { style: { maxWidth: '1000px', margin: '0 auto' }, children: [_jsxs(Card, { style: { marginBottom: '2rem', padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-color)' }, children: [_jsx("p", { style: { color: 'var(--text-secondary)' }, children: "[In a full implementation, this area mounts the existing CodingEditor or AptitudeQuestion UI based on `competition.type`.]" }), _jsx("p", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "For M38 validation, simulate answering by clicking the mock button below to trigger autosave and test the submission flow." }), _jsx(Button, { variant: "outline", onClick: () => handleAnswerChange('mock_q1', 'option_A'), style: { marginTop: '1rem' }, children: "Simulate Answering a Question" })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }, children: _jsxs("div", { children: ["Answered: ", Object.keys(answers).length, " / ", competition.challenges.length] }) })] }) })] }));
};
//# sourceMappingURL=CompetitionParticipationPage.js.map