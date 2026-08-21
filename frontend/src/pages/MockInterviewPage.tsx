import React from 'react';
import { ComingSoon } from '../components/ui/ComingSoon';
import { Video } from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  return (
    <ComingSoon
      moduleTitle="AI Mock Interview Simulator"
      moduleDescription="Experience dynamic AI-powered technical and behavioral interviews with real-time video/voice evaluation."
      icon={<Video size={36} />}
      features={[
        {
          title: 'Behavioral & HR Rounds',
          description: 'STAR-format question answering with AI sentiment and clarity feedback.',
        },
        {
          title: 'Technical Deep-Dives',
          description: 'Interactive follow-up questions based on your resume and project claims.',
        },
        {
          title: 'Comprehensive Performance Report',
          description: 'Recruiter-style evaluation card with key strengths and areas of growth.',
        },
      ]}
    />
  );
};
