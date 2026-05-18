import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/employees', label: '👥 Employees' },
    { path: '/ai-recommendations', label: '🤖 AI Insights' },
    { path: '/rankings', label: '🏆 Rankings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.logo}>
          ⚡ <span style={styles.logoText}>EmpAI</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(location.pathname === link.path ? styles.linkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User info */}
        <div style={styles.userSection}>
          <span style={styles.userInfo}>
            <span style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</span>
            <span style={styles.userName}>{user?.name}</span>
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={styles.mobilLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    background: 'rgba(18,18,26,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #2a2a40',
    zIndex: 1000,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#f0f0ff',
    fontWeight: 700,
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  logoText: {
    background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  links: {
    display: 'flex',
    gap: '4px',
    flex: 1,
    '@media (max-width: 768px)': { display: 'none' },
  },
  link: {
    padding: '6px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#8888aa',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  linkActive: {
    background: 'rgba(108,99,255,0.15)',
    color: '#6c63ff',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: 'auto',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
  userName: {
    color: '#f0f0ff',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  logoutBtn: {
    padding: '6px 16px',
    background: 'transparent',
    border: '1px solid #2a2a40',
    borderRadius: '8px',
    color: '#8888aa',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'all 0.2s',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#f0f0ff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    borderTop: '1px solid #2a2a40',
    background: '#12121a',
  },
  mobileLink: {
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#f0f0ff',
    borderRadius: '8px',
  },
  mobilLogout: {
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    color: '#ff4d6d',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '1rem',
  },
};

export default Navbar;
