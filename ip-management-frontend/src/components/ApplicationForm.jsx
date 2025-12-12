import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createApplication } from '../services/api';
import '../styles/Form.css';
import '../styles/Buttons.css';

const TABS = ['general', 'technical', 'review'];

function ApplicationForm({ user }) {
  const [currentTab, setCurrentTab] = useState('general');
  const [formData, setFormData] = useState({
    title: '',
    type: 'PATENT',
    ipc: '',
    authors: '',
    owner: '',
    objectType: 'PRODUCT',
    structure: '',
    materials: '',
    principle: '',
    steps: '',
    flowchart: '',
    description: '',
    summary: '',
    claims: '',
    files: [],
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, files: [...e.target.files] }));
  };

  const validateTab = (tab) => {
    const errors = {};
    if (tab === 'general') {
      if (!formData.title) errors.title = 'Title is required.';
      if (!formData.authors) errors.authors = 'Authors are required.';
      if (!formData.owner) errors.owner = 'Owner is required.';
    } else if (tab === 'technical') {
      if (!formData.description) errors.description = 'Detailed description is required.';
      if (!formData.claims) errors.claims = 'Protection claims are required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateTab(currentTab)) {
      const currentIndex = TABS.indexOf(currentTab);
      if (currentIndex < TABS.length - 1) {
        setCurrentTab(TABS[currentIndex + 1]);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = TABS.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(TABS[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTab('general') || !validateTab('technical')) {
        setError("Please fill out all required fields in all tabs.");
        return;
    }
    setError('');
    setMessage('');

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description); // Main description
    submissionData.append('userId', user.id);
    // Append other form data as needed by the backend
    // For simplicity, we are only sending title, description, and files as before
    if (formData.files.length > 0) {
      formData.files.forEach((file) => submissionData.append('files', file));
    }
    
    try {
      await createApplication(submissionData);
      setMessage('Application submitted successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/applications'), 2000);
    } catch (err) {
      setError(`Failed to submit application: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="form-container">
      <div className="back-link-container">
        <Link to="/applications" className="back-link">← Back to List</Link>
      </div>
      <h2>Submit New Application</h2>
      
      <div className="tab-navigation">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setCurrentTab(tab)} disabled={currentTab === tab} className={currentTab === tab ? 'active' : ''}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {currentTab === 'general' && (
          <div className="tab-content">
            <h3>General Information</h3>
            <div>
                <label>Invention Name:</label>
                <input name="title" value={formData.title} onChange={handleInputChange} />
                {formErrors.title && <p className="error-text">{formErrors.title}</p>}
            </div>
            {/* Add other fields for general tab as per design */}
          </div>
        )}

        {currentTab === 'technical' && (
          <div className="tab-content">
            <h3>Technical Documents</h3>
            <div>
                <label>Detailed Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" />
                {formErrors.description && <p className="error-text">{formErrors.description}</p>}
            </div>
            <div>
                <label>Protection Claims:</label>
                <textarea name="claims" value={formData.claims} onChange={handleInputChange} rows="5" />
                {formErrors.claims && <p className="error-text">{formErrors.claims}</p>}
            </div>
            <div>
                <label>Drawings / Files:</label>
                <input type="file" multiple onChange={handleFileChange} />
            </div>
          </div>
        )}

        {currentTab === 'review' && (
          <div className="tab-content">
            <h3>Review Application</h3>
            <div className="review-section">
                <h4>General Information</h4>
                <p><strong>Title:</strong> {formData.title || 'N/A'}</p>
                <h4>Technical Documents</h4>
                <p><strong>Description:</strong> {formData.description || 'N/A'}</p>
                <p><strong>Claims:</strong> {formData.claims || 'N/A'}</p>
                <p><strong>Files:</strong> {formData.files.length > 0 ? `${formData.files.length} file(s) selected` : 'None'}</p>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentTab !== 'general' && <button type="button" onClick={handleBack} className="button-secondary">Back</button>}
          {currentTab !== 'review' ? (
            <button type="button" onClick={handleNext} className="button-primary">Next</button>
          ) : (
            <button type="submit" className="button-success">Submit Application</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;