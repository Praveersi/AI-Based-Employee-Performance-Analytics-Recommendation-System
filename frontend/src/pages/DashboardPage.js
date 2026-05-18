import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllEmployees } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6c63ff', '#00d4aa', '#ffd166', '#ff4d6d', '#a78bfa', '#38bdf8'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Compute stats
  const totalEmployees = employees.length;
  const avgScore = totalEmployees ? Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / totalEmployees) : 0;
  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const needsAttention = employees.filter((e) => e.performanceScore < 50).length;

  // Dept chart data
  const deptMap = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  // Score distribution
  const scoreRanges = [
    { name: '0-39', count: employees.filter(e => e.performanceScore < 40).length },
    { name: '40-59', count: employees.filter(e => e.performanceScore >= 40 && e.performanceScore < 60).length },
    { name: '60-79', count: employees.filter(e => e.performanceScore >= 60 && e.performanceScore < 80).length },
    { name: '80-100', count: employees.filter(e => e.performanceScore >= 80).length },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#00d4aa';
    if (score >= 60) return '#ffd166';
    return '#ff4d6d';
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Welcome back, <strong style={{ color: 'var(--accent-primary)' }}>{user?.name}</strong>
          </p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { value: totalEmployees, label: 'Total Employees', icon: '👥' },
          { value: `${avgScore}%`, label: 'Avg Performance', icon: '📊' },
          { value: topPerformers, label: 'Top Performers', icon: '🌟' },
          { value: needsAttention, label: 'Needs Attention', icon: '⚠️' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreRanges}>
              <XAxis dataKey="name" stroke="#555577" fontSize={12} />
              <YAxis stroke="#555577" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a40', borderRadius: 8 }}
                labelStyle={{ color: '#f0f0ff' }}
              />
              <Bar dataKey="count" fill="#6c63ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Employees by Department
          </h3>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a40', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Recent employees */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>Recent Employees</h3>
          <Link to="/employees" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
            View all →
          </Link>
        </div>
        {employees.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            No employees yet. <Link to="/employees/add" style={{ color: 'var(--accent-primary)' }}>Add one!</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${getScoreColor(emp.performanceScore)}, #6c63ff)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                        }}>
                          {emp.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-dept">{emp.department}</span></td>
                    <td>
                      <div style={{ color: getScoreColor(emp.performanceScore), fontWeight: 600 }}>
                        {emp.performanceScore}/100
                      </div>
                      <div className="score-bar" style={{ width: 80 }}>
                        <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.experience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
