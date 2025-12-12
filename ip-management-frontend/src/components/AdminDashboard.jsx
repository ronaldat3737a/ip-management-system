import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api'; // Assuming this can be adapted for admin
import '../styles/Dashboard.css';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We'll use the existing DTO and service logic which was adapted for grouped stats
        // The service needs to know to fetch stats for all users, not a specific one.
        // We can pass a special ID or modify the backend, but for now we assume it works for admin.
        const response = await getDashboardStats(user.id); // This needs to be an admin-specific call
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      
      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <h3>{stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-card">
            <h3>{stats.inProgressApplications}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{stats.reviewApplications}</h3>
            <p>Under Review</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedApplications}</h3>
            <p>Completed/Granted</p>
          </div>
        </div>
      )}

      <div className="dashboard-columns">
        <div className="column">
          <h3>State Distribution (Placeholder)</h3>
          <div className="chart-placeholder">
            <p>Pie chart showing application distribution by stage.</p>
          </div>
        </div>
        <div className="column">
          <h3>Recent Activity (Placeholder)</h3>
          <ul className="recent-activity-list">
            <li>Application #2024-233 moved to "Substantive Examination".</li>
            <li>Application #2024-222 was returned for amendment.</li>
            <li>New application #2024-234 submitted.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
