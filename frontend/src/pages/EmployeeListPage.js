import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllEmployees, searchEmployees, deleteEmployee } from '../utils/api';

const DEPARTMENTS = ['All', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'];

const getScoreColor = (score) => {
  if (score >= 80) return '#00d4aa';
  if (score >= 60) return '#ffd166';
  return '#ff4d6d';
};

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async (dept = 'All', name = '') => {
    setLoading(true);
    try {
      let res;
      if (dept !== 'All' || name) {
        const params = {};
        if (dept !== 'All') params.department = dept;
        if (name) params.name = name;
        res = await searchEmployees(params);
      } else {
        res = await getAllEmployees();
      }
      setEmployees(res.data.data);
    } catch (e) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSearch = () => fetchEmployees(department, search);

  const handleDeptChange = (dept) => {
    setDepartment(dept);
    fetchEmployees(dept, search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteEmployee(id);
      toast.success(`${name} deleted`);
      setEmployees(employees.filter((e) => e._id !== id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
        <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            <label>Search by Name</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setDepartment('All'); fetchEmployees(); }}>
            Reset
          </button>
        </div>

        {/* Department filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDeptChange(dept)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: department === dept ? 'var(--accent-primary)' : 'var(--border)',
                background: department === dept ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: department === dept ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No employees found.{' '}
            <Link to="/employees/add" style={{ color: 'var(--accent-primary)' }}>Add one?</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Exp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${getScoreColor(emp.performanceScore)}, #6c63ff)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700
                        }}>{emp.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-dept">{emp.department}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 200 }}>
                        {emp.skills.slice(0, 3).map((s) => <span key={s} className="skill-tag">{s}</span>)}
                        {emp.skills.length > 3 && <span className="skill-tag">+{emp.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: getScoreColor(emp.performanceScore), fontWeight: 700 }}>
                        {emp.performanceScore}
                      </div>
                      <div className="score-bar" style={{ width: 70 }}>
                        <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.experience}y</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/employees/edit/${emp._id}`)}
                        >Edit</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp._id, emp.name)}
                          disabled={deleting === emp._id}
                        >
                          {deleting === emp._id ? '...' : 'Del'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;
