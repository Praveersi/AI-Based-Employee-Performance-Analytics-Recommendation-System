import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployeeById, updateEmployee } from '../utils/api';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'];

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', department: '', skills: [], performanceScore: '', experience: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data.data;
        setForm({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          skills: emp.skills,
          performanceScore: emp.performanceScore,
          experience: emp.experience,
        });
      } catch {
        toast.error('Failed to load employee');
        navigate('/employees');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      await updateEmployee(id, {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee updated!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Edit Employee</h1>
        <Link to="/employees" className="btn btn-secondary">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input name="experience" type="number" min="0" step="0.5" value={form.experience} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Performance Score (0–100)</label>
            <input name="performanceScore" type="number" min="0" max="100" value={form.performanceScore} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Add skill and press Enter" />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.skills.map((skill) => (
                <span key={skill} className="skill-tag" style={{ cursor: 'pointer', alignItems: 'center', display: 'inline-flex', gap: 4 }}>
                  {skill}
                  <span onClick={() => removeSkill(skill)} style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>×</span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link to="/employees" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;
