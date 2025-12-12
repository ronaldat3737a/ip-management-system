import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getApplicationById, updateApplicationStatus } from '../services/api';
import '../styles/Form.css';
import '../styles/Buttons.css';

const AmendmentPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [formData, setFormData] = useState({ description: '', claims: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getApplicationById(id);
        const app = response.data;
        setApplication(app);
        setFormData({
          description: app.description,
          claims: app.claims || '', // Assuming claims might not exist
        });
      } catch (err) {
        setError('Failed to fetch application details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      // Logic to update the application content would go here.
      // For now, we'll just resubmit it for examination.
      await updateApplicationStatus(id, { status: 'FORMALITY_EXAMINATION', rejectionReason: '' });
      setMessage('Application resubmitted successfully!');
      setTimeout(() => navigate(`/applications/${id}`), 2000);
    } catch (err) {
      setError(`Failed to resubmit application: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!application) return <p>Application not found.</p>;

  return (
    <div className="form-container">
      <div className="back-link-container">
        <Link to={`/applications/${id}`} className="back-link">← Back to Details</Link>
      </div>
      <h2>Amend Application - {application.title}</h2>
      
      {application.rejectionReason && (
        <div className="alert alert-warning">
          <strong>Reason for amendment:</strong> {application.rejectionReason}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" />
        </div>
        <div>
          <label>Protection Claims:</label>
          <textarea name="claims" value={formData.claims} onChange={handleInputChange} rows="5" />
        </div>
        {/* Add file upload if necessary */}
        <button type="submit" className="button-primary">Save and Resubmit</button>
      </form>
    </div>
  );
};

export default AmendmentPage;