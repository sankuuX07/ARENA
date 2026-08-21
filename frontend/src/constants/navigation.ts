import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Puzzle,
  Code2,
  ClipboardCheck,
  Video,
  FileText,
  Trophy,
  UserCheck,
  BarChart2,
  Briefcase
} from 'lucide-react';
import React from 'react';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  iconName: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  description: string;
  category: 'core' | 'prep' | 'assessment' | 'social';
  isComingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    icon: LayoutDashboard,
    description: 'Overview of your learning progress, activity, and metrics',
    category: 'core',
    isComingSoon: false,
  },
  {
    id: 'analytics',
    path: '/analytics',
    label: 'Student Analytics',
    iconName: 'BarChart2',
    icon: BarChart2,
    description: 'Unified view of your performance across all modules',
    category: 'core',
    isComingSoon: false,
  },
  {
    id: 'communication',
    path: '/communication',
    label: 'Communication',
    iconName: 'MessageSquare',
    icon: MessageSquare,
    description: 'AI-assisted speaking, presentation, and language fluency training',
    category: 'prep',
    isComingSoon: false,
  },
  {
    id: 'aptitude',
    path: '/aptitude',
    label: 'Aptitude',
    iconName: 'Brain',
    icon: Brain,
    description: 'Quantitative, logical reasoning, and verbal practice modules',
    category: 'prep',
    isComingSoon: false,
  },
  {
    id: 'puzzles',
    path: '/puzzles',
    label: 'Puzzles',
    iconName: 'Puzzle',
    icon: Puzzle,
    description: 'Brain teasers, analytical puzzles, and problem-solving challenges',
    category: 'prep',
    isComingSoon: false,
  },
  {
    id: 'technical',
    path: '/technical',
    label: 'Technical',
    iconName: 'Code2',
    icon: Code2,
    description: 'Data structures, algorithms, and CS fundamentals practice',
    category: 'prep',
    isComingSoon: false,
  },
  {
    id: 'assessments',
    path: '/assessments',
    label: 'Assessments',
    iconName: 'ClipboardCheck',
    icon: ClipboardCheck,
    description: 'Placement-style timed tests and company hiring simulation exams',
    category: 'assessment',
    isComingSoon: true,
  },
  {
    id: 'ai-interview',
    path: '/interview',
    label: 'AI Interview',
    iconName: 'UserCheck',
    icon: UserCheck,
    description: 'Practice real interview conversations with an AI interviewer',
    category: 'assessment',
    isComingSoon: false,
  },
  {
    id: 'placement',
    path: '/placement',
    label: 'Placement Simulation',
    iconName: 'Briefcase',
    icon: Briefcase,
    description: 'Experience a complete placement process across multiple rounds',
    category: 'assessment',
    isComingSoon: false,
  },
  {
    id: 'mock-interview',
    path: '/mock-interview',
    label: 'Mock Interview',
    iconName: 'Video',
    icon: Video,
    description: 'AI video/voice interview simulator with real-time feedback',
    category: 'assessment',
    isComingSoon: true,
  },
  {
    id: 'resume',
    path: '/resume',
    label: 'Resume Center',
    iconName: 'FileText',
    icon: FileText,
    description: 'Upload and manage your resume for screening and improvement',
    category: 'prep',
    isComingSoon: false,
  },
  {
    id: 'leaderboard',
    path: '/leaderboard',
    label: 'Leaderboard',
    iconName: 'Trophy',
    icon: Trophy,
    description: 'Global and cohort rankings based on solved challenges and metrics',
    category: 'social',
    isComingSoon: true,
  },
];
