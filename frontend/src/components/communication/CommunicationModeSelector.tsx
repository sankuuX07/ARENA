import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MessageSquare, Mic, Briefcase, Users, Play, Clock, Sparkles } from 'lucide-react';

export interface CommunicationModeSelectorProps {
  onSelectMode: (mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion') => void;
}

export const CommunicationModeSelector: React.FC<CommunicationModeSelectorProps> = ({ onSelectMode }) => {
  const modes = [
    {
      id: 'general' as const,
      title: 'General Practice',
      description: 'Interactive conversation practice covering self-introductions, technical summaries, and interview warm-ups.',
      icon: <MessageSquare size={22} />,
      badge: <Badge variant="success">Active</Badge>,
      isAvailable: true,
      milestone: 'Milestone 8 Foundation',
    },
    {
      id: 'fluency' as const,
      title: 'Spoken Fluency Drill',
      description: 'Interactive 5-turn English speaking fluency coaching with 7-criteria AI score evaluations.',
      icon: <Mic size={22} />,
      badge: <Badge variant="success">Active Module</Badge>,
      isAvailable: true,
      milestone: 'Milestone 9',
    },
    {
      id: 'formal' as const,
      title: 'Formal Corporate Tone',
      description: 'Corporate etiquette, executive vocabulary, and professional email/verbal tone practice.',
      icon: <Briefcase size={22} />,
      badge: <Badge variant="success">Active Module</Badge>,
      isAvailable: true,
      milestone: 'Milestone 10',
    },
    {
      id: 'situational' as const,
      title: 'Situational & Behavioral',
      description: 'STAR method response drills for behavioral workplace scenarios.',
      icon: <Sparkles size={22} />,
      badge: <Badge variant="success">Active Module</Badge>,
      isAvailable: true,
      milestone: 'Milestone 11',
    },
    {
      id: 'group_discussion' as const,
      title: 'AI Group Discussion',
      description: 'Multi-persona AI group discussion simulator with topic arguments and counter-points.',
      icon: <Users size={22} />,
      badge: <Badge variant="success">Active Module</Badge>,
      isAvailable: true,
      milestone: 'Milestone 12',
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Select Communication Practice Mode
        </h2>
        <p className="page-header-description" style={{ fontSize: '1rem', maxWidth: 650, margin: '0 auto' }}>
          Choose a practice mode to start an interactive AI coaching session. Build confidence and placement readiness.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {modes.map((mode) => (
          <Card
            key={mode.id}
            hoverLift={mode.isAvailable}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: mode.isAvailable ? 1 : 0.72,
              background: mode.isAvailable
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)'
                : 'var(--bg-surface)',
              border: mode.isAvailable ? '1.5px solid var(--border-color-glow)' : '1px solid var(--border-color)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    background: mode.isAvailable ? 'var(--primary-gradient)' : 'var(--bg-surface-elevated)',
                    color: '#ffffff',
                    display: 'flex',
                  }}
                >
                  {mode.icon}
                </div>
                {mode.badge}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                {mode.title}
              </h3>

              <p className="caption-text" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {mode.description}
              </p>
            </div>

            <Button
              variant={mode.isAvailable ? 'primary' : 'outline'}
              fullWidth
              disabled={!mode.isAvailable}
              icon={mode.isAvailable ? <Play size={16} /> : <Clock size={16} />}
              onClick={() => mode.isAvailable && onSelectMode(mode.id)}
            >
              {mode.isAvailable ? 'Start Session' : mode.milestone}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
