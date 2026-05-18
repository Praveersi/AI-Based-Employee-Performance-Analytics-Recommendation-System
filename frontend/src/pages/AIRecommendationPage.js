import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllEmployees, getAIRecommendation, getBulkFeedback } from '../utils/api';

const getScoreColor = (score) => {
  if (score >= 80) return '#00d4aa';
  if (score >= 60) return '#ffd166';
  return '#ff4d6d';
};

const AIRecommendationPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);

  useEffect(() => {
    getAllEmployees()
      .then((res) => setEmployees(res.data.data))
      .catch(() => toast.error('Failed to load employees'));
  }, []);

  const handleGetRecommendation = async () => {
    if (!selectedEmployee) { toast.error('Please select an employee'); return; }
    setLoadingRec(true);
    setRecommendation(null);
    try {
      const res = await getAIRecommendation(selectedEmployee);
      setRecommendation(res.data.data);
      toast.success('AI recommendation generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI recommendation failed. Check your API key.');
    } finally {
      setLoadingRec(false);
    }
  };

  const handleBulkFeedback = async () => {
    setLoadingBulk(true);
    setBulkResults([]);
    try {
      const res = await getBulkFeedback();
      setBulkResults(res.data.data);
      toast.success(`Generated feedback for ${res.data.count} employees`);
    } catch (err) {
      toast.error('Bulk feedback failed');
    } finally {
      setLoadingBulk(false);
    }
  };

  const selectedEmp = employees.find((e) => e._id === selectedEmployee);

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AI Recommendations</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Individual recommendation */}
        <div className="card">
          <h3 style={{ marginBottom: 4 }}>Individual Analysis</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
            Get AI-powered promotion, training & skill recommendations for a single employee.
          </p>

          <div className="form-group">
            <label>Select Employee</label>
            <select value={selectedEmployee} onChange={(e) => { setSelectedEmployee(e.target.value); setRecommendation(null); }}>
              <option value="">-- Choose an employee --</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name} — {e.department} (Score: {e.performanceScore})
                </option>
              ))}
            </select>
          </div>

          {selectedEmp && (
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 8, padding: 16, marginBottom: 16,
              border: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center'
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${getScoreColor(selectedEmp.performanceScore)}, #6c63ff)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1.2rem'
              }}>{selectedEmp.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedEmp.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedEmp.department} · {selectedEmp.experience}y exp</div>
                <div style={{ fontSize: '0.8rem', color: getScoreColor(selectedEmp.performanceScore), fontWeight: 600, marginTop: 2 }}>
                  Score: {selectedEmp.performanceScore}/100
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleGetRecommendation}
            disabled={loadingRec || !selectedEmployee}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loadingRec ? '🤖 Analyzing...' : '🤖 Generate Recommendation'}
          </button>
        </div>

        {/* Bulk feedback */}
        <div className="card">
          <h3 style={{ marginBottom: 4 }}>Bulk AI Feedback</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
            Generate quick AI feedback for all employees at once. Useful for periodic reviews.
          </p>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚡</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Mass Analysis</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Processes all {employees.length} employee{employees.length !== 1 ? 's' : ''} and saves AI feedback to their profiles.
            </div>
          </div>
          <button
            className="btn btn-success"
            onClick={handleBulkFeedback}
            disabled={loadingBulk || employees.length === 0}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loadingBulk ? '⚡ Processing...' : '⚡ Generate Bulk Feedback'}
          </button>
        </div>
      </div>

      {/* Recommendation output */}
      {recommendation && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>AI Analysis: {recommendation.employee.name}</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Generated at {new Date(recommendation.generatedAt).toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="badge badge-dept">{recommendation.employee.department}</span>
            <span style={{ color: getScoreColor(recommendation.employee.performanceScore), fontWeight: 600, fontSize: '0.875rem' }}>
              Score: {recommendation.employee.performanceScore}/100
            </span>
          </div>
          <div className="ai-output">{recommendation.recommendation}</div>
        </div>
      )}

      {/* Bulk results */}
      {bulkResults.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Bulk Feedback Results ({bulkResults.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bulkResults.map((r) => (
              <div key={r.id} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--accent-primary)' }}>{r.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{r.feedback}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {employees.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          No employees yet. Add employees first to use AI recommendations.
        </div>
      )}
    </div>
  );
};

export default AIRecommendationPage;
