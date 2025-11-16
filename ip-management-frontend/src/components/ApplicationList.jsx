import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications } from '../services/api';
import '../styles/Table.css';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAllApplications();
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Review Applications</h2>
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
                        <td>{app.submittedBy.username}</td>
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

export default ApplicationList;
