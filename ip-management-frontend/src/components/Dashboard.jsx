import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            const fetchStats = async () => {
                try {
                    const response = await getDashboardStats(user.id);
                    setStats(response.data);
                } catch (err) {
                    setError('Failed to fetch dashboard statistics.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="dashboard">
            <h2>Welcome, {user.username}!</h2>
            <p>This is your dashboard. Here you can manage your intellectual property applications.</p>
            
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{stats.totalApplications}</h3>
                    <p>Total Applications</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.pendingApplications}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.approvedApplications}</h3>
                    <p>Approved</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.rejectedApplications}</h3>
                    <p>Rejected</p>
                </div>
            </div>

            <div className="quick-actions">
                <Link to="/submit" className="btn btn-primary">Submit New Application</Link>
                <Link to="/applications/user" className="btn">View My Applications</Link>
            </div>

            <div className="notifications">
                <h3>Recent Notifications</h3>
                {/* Placeholder for notifications */}
                <p>No new notifications.</p>
            </div>
        </div>
    );
};

export default Dashboard;
