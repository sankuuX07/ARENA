import React from 'react';
import { Card } from '../ui/Card';
import { CompetitionLeaderboardEntry } from '../../types/competition';
import { Trophy } from 'lucide-react';

interface Props {
  entries: CompetitionLeaderboardEntry[];
  currentUserId?: string;
}

export const CompetitionLeaderboard: React.FC<Props> = ({ entries, currentUserId }) => {
  if (!entries || entries.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <Trophy size={48} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>Leaderboard is empty</h3>
        <p style={{ color: 'var(--text-muted)' }}>Check back later once results are calculated.</p>
      </Card>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontWeight: 'bold' }}>Rank</th>
              <th style={{ padding: '1rem', fontWeight: 'bold' }}>Participant</th>
              <th style={{ padding: '1rem', fontWeight: 'bold' }}>Score</th>
              <th style={{ padding: '1rem', fontWeight: 'bold' }}>Completed</th>
              <th style={{ padding: '1rem', fontWeight: 'bold' }}>Time Used</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              return (
                <tr 
                  key={entry.userId} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    background: isCurrentUser ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    fontWeight: isCurrentUser ? 'bold' : 'normal'
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    {entry.rank === 1 ? <span style={{ color: '#ffd700' }}>🥇 1</span> :
                     entry.rank === 2 ? <span style={{ color: '#c0c0c0' }}>🥈 2</span> :
                     entry.rank === 3 ? <span style={{ color: '#cd7f32' }}>🥉 3</span> :
                     entry.rank}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {entry.displayName} {isCurrentUser && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>(You)</span>}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{entry.score}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{entry.challengesCompleted}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{formatTime(entry.timeUsedSeconds)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
