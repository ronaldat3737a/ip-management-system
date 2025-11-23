import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css'; // Reuse the same dashboard styles for now

const ReviewerDashboard = ({ user }) => {
    // These stats would eventually come from a dedicated API endpoint
    const stats = {
        pendingReview: 15, // Placeholder
        inProgress: 3,     // Placeholder
        approved: 128,     // Placeholder
        rejected: 42,      // Placeholder
    };

    return (
        <div className="dashboard">
            <h2>Welcome, Reviewer {user.username}!</h2>
            <p>This is your dashboard. Here you can find an overview of your workload.</p>
            
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{stats.pendingReview}</h3>
                    <p>Pending Review</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.inProgress}</h3>
                    <p>In Progress</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.approved}</h3>
                    <p>Approved</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.rejected}</h3>
                    <p>Rejected</p>
                </div>
            </div>

            <div className="quick-actions">
                <Link to="/reviewer/pending" className="btn btn-primary">View Pending Submissions</Link>
                <Link to="/reviewer/all" className="btn">View All Submissions</Link>
            </div>
            
            <div className="notifications">
                <h3>Recent Activity</h3>
                {/* Placeholder for activity feed */}
                <p>No recent activity.</p>
            </div>
        </div>
    );
};

export default ReviewerDashboard;
