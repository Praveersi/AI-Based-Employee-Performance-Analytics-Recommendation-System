import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getAIRankings } from '../utils/api';

const getScoreColor = (score) => {
  if (score >= 80) return '#00d4aa';
  if (score >= 60) return '#ffd166';
  return '#ff4d6d';
};

const getRankBadge = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const RankingsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchRankings = async () => {
    setLoading(true);
    try {
      const res = await getAIRankings();
      setData(res.data.data);
      toast.success('Rankings generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get rankings. Ensure employees exist and AI key is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏆 Employee Rankings</h1>
        <button className="btn btn-primary" onClick={handleFetchRankings} disabled={loading}>
          {loading ? '🤖 Analyzing...' : '🤖 Generate AI Rankings'}
        </button>
      </div>

      {!data && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
          <h2 style={{ marginBottom: 8 }}>AI-Powered Rankings</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            Click the button above to rank all employees by performance score<br />and get an AI analysis of your team.
          </p>
          <button className="btn btn-primary" onClick={handleFetchRankings}>
            Generate Rankings
          </button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          Analyzing team performance...
        </div>
      )}

      {data && (
        <>
          {/* Stats summary */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-value">{data.totalEmployees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>
                {data.rankings[0]?.name?.split(' ')[0] || '—'}
              </div>
              <div className="stat-label">Top Performer</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {data.rankings[0]?.performanceScore || 0}
              </div>
              <div className="stat-label">Highest Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {Math.round(data.rankings.reduce((s, e) => s + e.performanceScore, 0) / data.rankings.length)}
              </div>
              <div className="stat-label">Team Average</div>
            </div>
          </div>

          {/* Rankings table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Performance Leaderboard</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Score</th>
                    <th>Experience</th>
                    <th>Key Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rankings.map((emp) => (
                    <tr key={emp.id} style={emp.rank <= 3 ? { background: 'rgba(108,99,255,0.05)' } : {}}>
                      <td style={{ fontSize: emp.rank <= 3 ? '1.5rem' : '1rem', fontWeight: 700 }}>
                        {getRankBadge(emp.rank)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg, ${getScoreColor(emp.performanceScore)}, #6c63ff)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700
                          }}>{emp.name[0]}</div>
                          <div style={{ fontWeight: 600 }}>{emp.name}</div>
                        </div>
                      </td>
                      <td><span className="badge badge-dept">{emp.department}</span></td>
                      <td>
                        <div style={{ color: getScoreColor(emp.performanceScore), fontWeight: 700, fontSize: '1.1rem' }}>
                          {emp.performanceScore}
                        </div>
                        <div className="score-bar" style={{ width: 80 }}>
                          <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }} />
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.experience} yrs</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {emp.skills.slice(0, 2).map((s) => <span key={s} className="skill-tag">{s}</span>)}
                          {emp.skills.length > 2 && <span className="skill-tag">+{emp.skills.length - 2}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI analysis */}
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>🤖 AI Team Analysis</h3>
            <div className="ai-output">{data.aiAnalysis}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingsPage;
