import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationById, updateApplicationStatus, downloadFile } from '../services/api';
import '../styles/Buttons.css';

const detailStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const sectionStyle = {
    marginBottom: '2rem',
};

const fileListStyle = {
    listStyle: 'none',
    padding: 0,
};

const fileListItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
};


const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getApplicationById(id);
        setApplication(response.data);
        setStatus(response.data.status);
      } catch (err) {
        setError('Failed to fetch application details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await updateApplicationStatus(id, newStatus);
      setApplication(response.data);
      setStatus(response.data.status);
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    }
  };

  const handleFileDownload = async (file) => {
    try {
        const response = await downloadFile(file.id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (err) {
        setError(`Failed to download file ${file.fileName}.`);
        console.error(err);
    }
  };

  if (loading) return <p>Loading application details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!application) return <p>No application found.</p>;

  return (
    <div style={detailStyle}>
      <h2>Application Details</h2>
      
      <div style={sectionStyle}>
          <p><strong>ID:</strong> {application.id}</p>
          <p><strong>Title:</strong> {application.title}</p>
          <p><strong>Description:</strong> {application.description}</p>
          <p><strong>Submitted By:</strong> {application.submittedBy.username}</p>
          <p><strong>Current Status:</strong> <span style={{ fontWeight: 'bold', color: status === 'APPROVED' ? 'green' : status === 'REJECTED' ? 'red' : 'orange' }}>{status}</span></p>
      </div>

      <div style={sectionStyle}>
        <h3>Attached Files</h3>
        <ul style={fileListStyle}>
          {application.files.map((file) => (
            <li key={file.id} style={fileListItemStyle}>
              <span>{file.fileName}</span>
              <button onClick={() => handleFileDownload(file)}>Download</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3>Reviewer Actions</h3>
        <div>
          <button onClick={() => handleStatusUpdate('APPROVED')} disabled={status === 'APPROVED'}>
            Approve
          </button>
          <button onClick={() => handleStatusUpdate('REJECTED')} disabled={status === 'REJECTED'} style={{ backgroundColor: '#dc3545' }}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
