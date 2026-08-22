import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getStudentRank } from '../services/rankingService';
import { LeaderboardEntry, StudentRankSummary } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Trophy,
  Award,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn } from '../utils/motion';

export const LeaderboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [studentRankSummary, setStudentRankSummary] = useState<StudentRankSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);

      if (currentUser) {
        const rankSummary = await getStudentRank(currentUser.uid);
        setStudentRankSummary(rankSummary);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [currentUser]);

  const getInitials = (name?: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading competitive leaderboard standings..." size={22} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header" style={{ justifyContent: 'center' }}>
            <AlertCircle size={20} />
            <span className="error-title">Leaderboard Error</span>
          </div>
          <div className="error-message" style={{ textAlign: 'center' }}>
            {error}
          </div>
        </div>
        <Button variant="primary" icon={<RefreshCw size={16} />} onClick={loadLeaderboardData}>
          Try Again
        </Button>
      </div>
    );
  }

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const currentStudentRankNum = studentRankSummary?.rank;

  return (
    <motion.div 
      style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeIn}>
        <PageHeader
        title="Competitive Leaderboard"
        description="Compete with fellow ARENA students, solve practice challenges, and climb placement readiness ranks."
        icon={<Trophy size={24} />}
        badge={
          <Badge variant="primary" icon={<Sparkles size={12} />}>
            Deterministic Engine
          </Badge>
        }
      />
      </motion.div>

      {/* Logged-In Student Pinned Position Card */}
      {currentUser && (
        <Card
          style={{
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1.5px solid var(--border-color-glow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {userProfile?.profilePhotoUrl ? (
                  <img
                    src={userProfile.profilePhotoUrl}
                    alt={userProfile.fullName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(userProfile?.fullName)
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 className="card-title" style={{ fontSize: '1.15rem' }}>
                    {userProfile?.fullName || 'Your Position'}
                  </h3>
                  <Badge variant="primary">You</Badge>
                </div>
                <p className="caption-text" style={{ fontSize: '0.85rem' }}>
                  {currentStudentRankNum === 1
                    ? "You're currently Rank #1! Keep practicing to stay on top."
                    : currentStudentRankNum
                    ? `Ranked #${currentStudentRankNum} among ${studentRankSummary?.totalStudents || 1} students.`
                    : 'Start practicing to establish your rank.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <span className="caption-text" style={{ fontSize: '0.75rem', display: 'block' }}>
                  Current Rank
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {studentRankSummary?.rankFormatted || '#--'}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className="caption-text" style={{ fontSize: '0.75rem', display: 'block' }}>
                  Total Score
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {studentRankSummary?.score || 0} pts
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className="caption-text" style={{ fontSize: '0.75rem', display: 'block' }}>
                  Accuracy
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                  {studentRankSummary?.accuracy || 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Top 3 Podium Section */}
      {leaderboard.length > 0 && (
        <motion.div style={{ marginBottom: '2.5rem' }} variants={staggerItem}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
            Top Percentile Champions
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              alignItems: 'end',
            }}
          >
            {/* Rank 2 (Silver) */}
            {top2 ? (
              <Card
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface-elevated)',
                  border: '1.5px solid rgba(148, 163, 184, 0.4)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                  <Badge variant="neutral" style={{ background: '#94a3b8', color: '#0f172a', fontWeight: 800 }}>
                    🥈 Rank #2
                  </Badge>
                </div>

                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: '0.75rem auto 0.6rem',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                  }}
                >
                  {top2.profilePhotoUrl ? (
                    <img
                      src={top2.profilePhotoUrl}
                      alt={top2.displayName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(top2.displayName)
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {top2.displayName}
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {top2.score} pts
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {top2.accuracy}% Accuracy • {top2.problemsSolved} Solved
                </div>
              </Card>
            ) : null}

            {/* Rank 1 (Gold - Elevated Center) */}
            {top1 ? (
              <Card
                style={{
                  padding: '1.85rem 1rem',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  border: '2px solid rgba(234, 179, 8, 0.6)',
                  position: 'relative',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                  <Badge variant="warning" style={{ background: '#eab308', color: '#0f172a', fontWeight: 800, padding: '0.3rem 0.75rem' }}>
                    🥇 Rank #1 Champion
                  </Badge>
                </div>

                <div
                  style={{
                    width: 76,
                    height: 76,
                    margin: '0.75rem auto 0.6rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)',
                  }}
                >
                  {top1.profilePhotoUrl ? (
                    <img
                      src={top1.profilePhotoUrl}
                      alt={top1.displayName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(top1.displayName)
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {top1.displayName}
                </h3>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--warning)' }}>
                  {top1.score} pts
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {top1.accuracy}% Accuracy • {top1.problemsSolved} Solved
                </div>
              </Card>
            ) : null}

            {/* Rank 3 (Bronze) */}
            {top3 ? (
              <Card
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface-elevated)',
                  border: '1.5px solid rgba(217, 119, 6, 0.4)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                  <Badge variant="warning" style={{ background: '#d97706', color: '#ffffff', fontWeight: 800 }}>
                    🥉 Rank #3
                  </Badge>
                </div>

                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: '0.75rem auto 0.6rem',
                    borderRadius: '50%',
                    background: '#d97706',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                  }}
                >
                  {top3.profilePhotoUrl ? (
                    <img
                      src={top3.profilePhotoUrl}
                      alt={top3.displayName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(top3.displayName)
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {top3.displayName}
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {top3.score} pts
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {top3.accuracy}% Accuracy • {top3.problemsSolved} Solved
                </div>
              </Card>
            ) : null}
          </div>
        </motion.div>
      )}

      {/* Main Leaderboard Table / Standings */}
      <motion.div variants={staggerItem}>
        <Card>
        <div className="arena-card-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="card-title">All Student Standings</h2>
          </div>
          <Badge variant="neutral">{leaderboard.length} Students</Badge>
        </div>

        {leaderboard.length === 0 ? (
          <EmptyState
            title="No rankings available yet"
            description="Start practicing to establish your position on the ARENA leaderboard."
            icon={<Trophy size={32} />}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '0.75rem 1rem', width: 70 }}>Rank</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                  <th style={{ padding: '0.75rem 1rem', width: 110 }}>Score</th>
                  <th style={{ padding: '0.75rem 1rem', width: 100 }}>Accuracy</th>
                  <th style={{ padding: '0.75rem 1rem', width: 110 }}>Solved</th>
                  <th style={{ padding: '0.75rem 1rem', width: 90, textAlign: 'center' }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isCurrent = currentUser && currentUser.uid === entry.uid;

                  return (
                    <motion.tr
                      key={entry.uid}
                      variants={staggerItem}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        background: isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                        fontWeight: isCurrent ? 600 : 400,
                      }}
                    >
                      {/* Rank Number */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {entry.rank === 1 ? (
                            <Badge variant="warning">#1</Badge>
                          ) : entry.rank === 2 ? (
                            <Badge variant="neutral">#2</Badge>
                          ) : entry.rank === 3 ? (
                            <Badge variant="warning" style={{ background: '#d97706', color: '#fff' }}>
                              #3
                            </Badge>
                          ) : (
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              #{entry.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: 'var(--primary-gradient)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                            }}
                          >
                            {entry.profilePhotoUrl ? (
                              <img
                                src={entry.profilePhotoUrl}
                                alt={entry.displayName}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : (
                              getInitials(entry.displayName)
                            )}
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>
                              {entry.displayName}
                            </span>
                            {isCurrent && (
                              <Badge variant="primary" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {entry.score} pts
                      </td>

                      {/* Accuracy */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--success)' }}>
                        {entry.accuracy}%
                      </td>

                      {/* Problems Solved */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {entry.problemsSolved}
                      </td>

                      {/* Rank Change Indicator */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        —
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      </motion.div>
    </motion.div>
  );
};
