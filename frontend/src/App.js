import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import AIRecommendationPage from './pages/AIRecommendationPage';
import RankingsPage from './pages/RankingsPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <div className={user ? 'main-content' : ''}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeeListPage /></ProtectedRoute>} />
          <Route path="/employees/add" element={<ProtectedRoute><AddEmployeePage /></ProtectedRoute>} />
          <Route path="/employees/edit/:id" element={<ProtectedRoute><EditEmployeePage /></ProtectedRoute>} />
          <Route path="/ai-recommendations" element={<ProtectedRoute><AIRecommendationPage /></ProtectedRoute>} />
          <Route path="/rankings" element={<ProtectedRoute><RankingsPage /></ProtectedRoute>} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
