import React from 'react';
import { ComingSoon } from '../components/ui/ComingSoon';
import { Puzzle } from 'lucide-react';

export const PuzzlesPage: React.FC = () => {
  return (
    <ComingSoon
      moduleTitle="Puzzles & Analytical Challenges"
      moduleDescription="Sharpen your out-of-the-box thinking with classic tech interview riddles, probability puzzles, and lateral thinking exercises."
      icon={<Puzzle size={36} />}
      features={[
        {
          title: 'Classic Interview Riddles',
          description: 'Step-by-step breakdown of top company puzzle questions.',
        },
        {
          title: 'Mathematical & Probability Puzzles',
          description: 'Challenge your mental quantitative problem-solving skills.',
        },
        {
          title: 'Interactive Hint Engine',
          description: 'Structured guidance without giving away the final solution instantly.',
        },
      ]}
    />
  );
};
