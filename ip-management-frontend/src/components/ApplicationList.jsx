import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications, getApplicationsByUserId } from '../services/api';
import '../styles/Table.css';
import '../styles/Form.css';
import '../styles/Dashboard.css';

const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(?: |\b)(\w)/g, (char) => char.toUpperCase());
};

const STAGES = [
  'DRAFTING_AND_FILING',
  'FORMALITY_EXAMINATION',
  'APPLICATION_PUBLICATION',
  'SUBSTANTIVE_EXAMINATION_REQUEST',
  'SUBSTANTIVE_EXAMINATION',
  'FEE_PAYMENT_AND_GRANT',
];

const ApplicationList = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const isUser = user && user.role === 'USER';
  const pageTitle = isUser ? 'My Applications' : 'Review Applications';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = isUser ? await getApplicationsByUserId(user.id) : await getAllApplications();
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, isUser]);

  const getAction = (app) => {
    if (app.rejectionReason) {
      return <Link to={`/applications/${app.id}/amend`} className="action-button button-warning">Update</Link>;
    }
    switch (app.status) {
      case 'SUBSTANTIVE_EXAMINATION_REQUEST':
        return <Link to={`/applications/${app.id}`} className="action-button">Send Request</Link>;
      case 'FEE_PAYMENT_AND_GRANT':
        return <Link to={`/applications/${app.id}/payment`} className="action-button button-success">Pay Fee</Link>;
      default:
        return <Link to={`/applications/${app.id}`} className="action-button">View</Link>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const titleMatch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
    const stageMatch = stageFilter ? app.status === stageFilter : true;
    return titleMatch && stageMatch;
  });

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{pageTitle}</h2>
        <Link to="/applications/new" className="button-primary">New Application</Link>
      </div>
      
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="filter-select">
          <option value="">All Stages</option>
          {STAGES.map(stage => <option key={stage} value={stage}>{formatStatus(stage)}</option>)}
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              {!isUser && <th>Submitted By</th>}
              <th>Current Stage</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.title}</td>
                {!isUser && <td>{app.submittedByUsername}</td>}
                <td>{formatStatus(app.status)}</td>
                <td className={app.rejectionReason ? 'status-rejected' : 'status-pending'}>
                  {app.rejectionReason ? 'Amendment Required' : 'Processing'}
                </td>
                <td>{getAction(app)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationList;
