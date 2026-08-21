import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_TAGLINE } from '../constants';
import { HealthStatus } from '../components/HealthStatus';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Brain,
  Code2,
  BookOpen,
  ClipboardCheck,
  Video,
  FileText,
  Compass,
  Trophy,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
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
      icon: <MessageSquare size={24} />,
      title: 'AI Communication',
      description: 'Improve spoken fluency, formal tone, situational expression, and group discussion confidence.',
      tags: ['Speech Coaching', 'GD Practice', 'Fluency Analysis'],
      path: '/communication',
    },
    {
      icon: <Brain size={24} />,
      title: 'Aptitude Practice',
      description: 'Master quantitative math, logical reasoning, and verbal aptitude with targeted practice sets.',
      tags: ['Quant Math', 'Logical Reasoning', 'Verbal Skills'],
      path: '/aptitude',
    },
    {
      icon: <Code2 size={24} />,
      title: 'Problem Solving',
      description: 'Practice coding challenges, data structures, and algorithmic problems for tech rounds.',
      tags: ['Data Structures', 'Algorithms', 'Code Execution'],
      path: '/technical',
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Technical Preparation',
      description: 'Prepare across core CS subjects including OS, DBMS, Computer Networks, and System Design.',
      tags: ['OS & DBMS', 'Networking', 'CS Fundamentals'],
      path: '/technical',
    },
    {
      icon: <ClipboardCheck size={24} />,
      title: 'Placement Assessments',
      description: 'Simulate full company hiring tests with timed sections and automated evaluation.',
      tags: ['Timed Tests', 'Company Patterns', 'Diagnostic Report'],
      path: '/assessments',
    },
    {
      icon: <Video size={24} />,
      title: 'AI Mock Interview',
      description: 'Participate in realistic video/voice interview simulations with dynamic follow-up questions.',
      tags: ['Voice & Video', 'Behavioral Rounds', 'Instant Feedback'],
      path: '/mock-interview',
    },
    {
      icon: <FileText size={24} />,
      title: 'Resume Screening',
      description: 'Analyze your resume against ATS criteria, job descriptions, and industry benchmarks.',
      tags: ['ATS Analysis', 'Keyword Matching', 'Score Optimization'],
      path: '/resume',
    },
  ];

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-pill">
          <Sparkles size={14} />
          <span>ARENA UI/UX Foundation Active</span>
        </div>

        <h1 className="landing-title">
          Master Your Placement Journey with <span className="text-gradient">ARENA</span>
        </h1>

        <p className="landing-tagline">{APP_TAGLINE}</p>

        <p className="landing-desc">
          ARENA is a unified student competitive learning and placement-preparation platform designed to integrate coding practice, aptitude drills, AI communication, mock interviews, and resume analytics into a single seamless ecosystem.
        </p>

        <div className="landing-actions">
          <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button variant="secondary" size="lg" icon={<Compass size={18} />} onClick={handleExplore}>
            Explore ARENA
          </Button>
        </div>

        {/* Hero Visual Preview Banner */}
        <div style={{ maxWidth: 850, width: '100%', margin: '0 auto' }}>
          <Card hoverLift style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Trophy size={18} style={{ color: 'var(--primary)' }} />
                <span>Placement Readiness Ecosystem</span>
              </div>
              <Badge variant="success">Milestone 2 Verified</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student Cohorts</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Competitive</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prep Modules</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>7 Modules</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Assistance</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Intelligent</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features-section" className="features-section">
        <div className="section-header-center">
          <h2 className="section-title" style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>
            Comprehensive Placement Preparation
          </h2>
          <p className="body-text">
            Everything you need to excel in campus placements and technical recruitment in one platform.
          </p>
        </div>

        <div className="feature-cards-grid">
          {featureCards.map((card, idx) => (
            <Card key={idx} hoverLift className="feature-card">
              <div className="feature-card-icon">{card.icon}</div>
              <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                {card.title}
              </h3>
              <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                {card.description}
              </p>
              <div className="feature-tag-list">
                {card.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="feature-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Connectivity Section (Preserving Milestone 1 Health Check) */}
      <section style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <HealthStatus />
      </section>
    </div>
  );
};
