import React from 'react';
import { ComingSoon } from '../components/ui/ComingSoon';
import { ClipboardCheck } from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  return (
    <ComingSoon
      moduleTitle="Placement-Style Assessments"
      moduleDescription="Take timed, full-length placement test simulations modeled after top product and service tier companies."
      icon={<ClipboardCheck size={36} />}
      features={[
        {
          title: 'Company Pattern Exams',
          description: 'Customized mock tests aligned with specific hiring patterns.',
        },
        {
          title: 'Strict Proctored Environment',
          description: 'Simulate high-pressure exam conditions with section timers.',
        },
        {
          title: 'Detailed Score Diagnostic',
          description: 'Identify topic weaknesses and receive targeted improvement roadmaps.',
        },
      ]}
    />
  );
};
