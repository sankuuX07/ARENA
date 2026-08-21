import React from 'react';
import { ComingSoon } from '../components/ui/ComingSoon';
import { FileText } from 'lucide-react';

export const ResumePage: React.FC = () => {
  return (
    <ComingSoon
      moduleTitle="AI Resume Screening & Optimizer"
      moduleDescription="Upload your resume to check ATS compliance score, action verb strength, and job description alignment."
      icon={<FileText size={36} />}
      features={[
        {
          title: 'ATS Scanner Engine',
          description: 'Identify formatting glitches, missing keywords, and readability issues.',
        },
        {
          title: 'Job Match Analyzer',
          description: 'Compare your resume against specific target role descriptions.',
        },
        {
          title: 'Impact Bullet Generator',
          description: 'AI suggestions to convert weak responsibilities into quantifiable achievements.',
        },
      ]}
    />
  );
};
