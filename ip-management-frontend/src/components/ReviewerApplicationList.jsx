import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications } from '../services/api';
import '../styles/Table.css';
import '../styles/Form.css'; // For back link

const ReviewerApplicationList = ({ title, filter = {} }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAllApplications(filter);
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filter]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="list-container">
      <div className="back-link-container">
          <Link to="/reviewer/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
      <h2>{title}</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Submitted By</th>
                    <th>Status</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {applications.map((app) => (
                    <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>{app.title}</td>
                        <td>{app.submittedByUsername}</td>
                        <td>{app.status}</td>
                        <td><Link to={`/applications/${app.id}`}>View Details</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewerApplicationList;
