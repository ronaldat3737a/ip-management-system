import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import ApplicationDetail from './components/ApplicationDetail';
import AmendmentPage from './components/AmendmentPage';
import PaymentPage from './components/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import ReviewerDashboard from './components/ReviewerDashboard';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const defaultAuthenticatedRoute = user ? (user.role === 'REVIEWER' ? '/reviewer/dashboard' : '/applications') : '/login';

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginForm onLogin={handleLogin} /> : <Navigate to={defaultAuthenticatedRoute} />} />
        <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to={defaultAuthenticatedRoute} />} />

        {/* Protected Routes for USER */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['USER']} />}>
          <Route path="/applications" element={<div className="container"><ApplicationList user={user} /></div>} />
          <Route path="/applications/new" element={<div className="container"><ApplicationForm user={user} /></div>} />
        </Route>

        {/* Protected Routes for REVIEWER */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['REVIEWER']} />}>
          <Route path="/reviewer" element={<ReviewerDashboard />}>
            <Route path="dashboard" element={<AdminDashboard user={user} />} />
            <Route path="applications" element={<ApplicationList user={user} />} />
          </Route>
        </Route>

        {/* Routes accessible by BOTH */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['USER', 'REVIEWER']} />}>
           <Route path="/applications/:id" element={<div className="container"><ApplicationDetail user={user} /></div>} />
           <Route path="/applications/:id/amend" element={<div className="container"><AmendmentPage user={user} /></div>} />
           <Route path="/applications/:id/payment" element={<div className="container"><PaymentPage user={user} /></div>} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to={defaultAuthenticatedRoute} />} />
        
        {/* Fallback for any other route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
