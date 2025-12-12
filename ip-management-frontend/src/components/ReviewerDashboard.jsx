import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/ReviewerDashboard.css';

const ReviewerDashboard = () => {
    const location = useLocation();

    return (
        <div className="reviewer-layout">
            <nav className="sidebar">
                <h3>Admin Menu</h3>
                <ul>
                    <li className={location.pathname === '/reviewer/dashboard' ? 'active' : ''}>
                        <Link to="/reviewer/dashboard">📊 Dashboard</Link>
                    </li>
                    <li className={location.pathname === '/reviewer/applications' ? 'active' : ''}>
                        <Link to="/reviewer/applications">📄 Applications</Link>
                    </li>
                    {/* Add more admin links here as needed */}
                </ul>
            </nav>
            <main className="main-content">
                <Outlet /> {/* This will render the nested route's component */}
            </main>
        </div>
    );
};

export default ReviewerDashboard;
