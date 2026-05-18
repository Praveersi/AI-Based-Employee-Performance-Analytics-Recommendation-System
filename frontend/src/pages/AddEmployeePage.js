import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addEmployee } from '../utils/api';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'];

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', department: 'Development',
    skills: [], performanceScore: '', experience: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      await addEmployee({
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add employee';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Employee</h1>
        <Link to="/employees" className="btn btn-secondary">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Aman Verma" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="aman@gmail.com" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience *</label>
              <input name="experience" type="number" min="0" step="0.5" value={form.experience} onChange={handleChange} placeholder="3" required />
            </div>
          </div>

          <div className="form-group">
            <label>Performance Score (0–100) *</label>
            <input name="performanceScore" type="number" min="0" max="100" value={form.performanceScore} onChange={handleChange} placeholder="85" required />
            {form.performanceScore && (
              <div style={{ marginTop: 8 }}>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${form.performanceScore}%`,
                      background: Number(form.performanceScore) >= 80 ? '#00d4aa' : Number(form.performanceScore) >= 60 ? '#ffd166' : '#ff4d6d'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Skills *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React, Node.js — press Enter or Add"
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill} style={{ flexShrink: 0 }}>Add</button>
            </div>
            {form.skills.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {form.skills.map((skill) => (
                  <span key={skill} className="skill-tag" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {skill}
                    <span onClick={() => removeSkill(skill)} style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Link to="/employees" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '✓ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
