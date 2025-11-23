import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications, getApplicationsByUserId } from '../services/api';
import '../styles/Table.css';

const ApplicationList = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const isReviewer = user && user.role === 'REVIEWER';
  const pageTitle = isReviewer ? 'Review Applications' : 'My Applications';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let response;
        if (user && user.role === 'USER') {
          response = await getApplicationsByUserId(user.id);
        } else {
          // Default to reviewer view (all applications)
          response = await getAllApplications();
        }
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>{pageTitle}</h2>
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
                        {/* Link to details is different for user vs reviewer in some systems, but same here for now */}
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