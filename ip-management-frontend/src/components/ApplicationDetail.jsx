import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplicationById, updateApplicationStatus } from '../services/api';
import Modal from './Modal';
import '../styles/Buttons.css';
import '../styles/Form.css';
import '../styles/App.css';
import '../styles/ApplicationDetail.css';

const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status.toLowerCase().replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, (char) => char.toUpperCase());
};

const STAGES = [
  'DRAFTING_AND_FILING', 'FORMALITY_EXAMINATION', 'APPLICATION_PUBLICATION',
  'SUBSTANTIVE_EXAMINATION_REQUEST', 'SUBSTANTIVE_EXAMINATION', 'FEE_PAYMENT_AND_GRANT'
];

const ApplicationDetail = ({ user }) => {
  const { id } = useParams();

  // Component State
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState('');
  
  // Reviewer-specific state
  const [adminTab, setAdminTab] = useState('dossier');
  const [modalAction, setModalAction] = useState(null); // e.g., 'reject', 'requestInfo'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getApplicationById(id);
        const fetchedApp = response.data;
        setApplication(fetchedApp);
        if (user.role === 'REVIEWER' || (user.role === 'USER' && fetchedApp.submittedByUsername === user.username)) {
          setIsAuthorized(true);
        }
      } catch (err) {
        setError('Failed to fetch application details.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchApplication();
  }, [id, user]);

  const handleStatusUpdate = async (newStatus, reason = '') => {
    setStatusChangeError('');
    try {
      const response = await updateApplicationStatus(id, { status: newStatus, rejectionReason: reason });
      setApplication(response.data);
      setRejectionReason('');
      setIsModalOpen(false);
      setModalAction(null);
    } catch (err) {
      setStatusChangeError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const openModal = (action) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const renderReviewerActions = () => {
    const status = application.status;
    return (
      <div className="action-panel">
        <h4>Action Panel</h4>
        {status === 'FORMALITY_EXAMINATION' && (
          <>
            <button className="button-success" onClick={() => handleStatusUpdate('APPLICATION_PUBLICATION')}>✔ Pass Formality Check</button>
            <button className="button-warning" onClick={() => openModal('requestCorrection')}>❌ Request Correction</button>
          </>
        )}
        {status === 'APPLICATION_PUBLICATION' && <button onClick={() => handleStatusUpdate('SUBSTANTIVE_EXAMINATION_REQUEST')}>📣 Publish Application</button>}
        {status === 'SUBSTANTIVE_EXAMINATION_REQUEST' && <button onClick={() => handleStatusUpdate('SUBSTANTIVE_EXAMINATION')}>✔ Confirm Request</button>}
        {status === 'SUBSTANTIVE_EXAMINATION' && (
          <>
            <button className="button-success" onClick={() => handleStatusUpdate('FEE_PAYMENT_AND_GRANT')}>✔ Pass Substantive Exam</button>
            <button className="button-danger" onClick={() => openModal('reject')}>❌ Reject Application</button>
          </>
        )}
        {status === 'FEE_PAYMENT_AND_GRANT' && <p>Waiting for user to pay the fee.</p>}
        {status === 'DRAFTING_AND_FILING' && <p>Waiting for user to submit.</p>}
      </div>
    );
  };

  const renderUserActions = () => {
    const status = application.status;
     if (application.rejectionReason && status === 'DRAFTING_AND_FILING') {
      return <Link to={`/applications/${id}/amend`} className="button-primary">✏️ Amend and Resubmit</Link>;
    }
    switch (status) {
      case 'DRAFTING_AND_FILING':
        return <button onClick={() => handleStatusUpdate('FORMALITY_EXAMINATION')}>Submit for Examination</button>;
      case 'SUBSTANTIVE_EXAMINATION_REQUEST':
        return <button onClick={() => handleStatusUpdate('SUBSTANTIVE_EXAMINATION')}>Activate Substantive Examination</button>;
      case 'FEE_PAYMENT_AND_GRANT':
        return <Link to={`/applications/${id}/payment`} className="button-success">Pay Fee & Receive Patent</Link>;
      default:
        return <p>No actions available at this stage. Please wait for the reviewer.</p>;
    }
  };

  const renderModalContent = () => {
    if (!modalAction) return null;

    return (
        <div>
            <div className="form-group">
                <label>Reason:</label>
                <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="4"
                    style={{ width: '100%' }}
                />
            </div>
            <button 
                className="button-primary" 
                onClick={() => handleStatusUpdate('DRAFTING_AND_FILING', rejectionReason)}
                disabled={!rejectionReason}
            >
                Confirm & Send to User
            </button>
        </div>
    );
  };
  
  if (loading) return <p>Loading application details...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!isAuthorized) return <p className="error-text">You are not authorized to view this application.</p>;
  if (!application) return <p>No application found.</p>;

  const isReviewer = user.role === 'REVIEWER';
  const currentStatusIndex = STAGES.indexOf(application.status);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Action: ${formatStatus(modalAction)}`}>
        {renderModalContent()}
      </Modal>

      <div className="detail-header">
        <div>
          <h2>{application.title}</h2>
          <p>ID: {application.id} | Submitted by: {application.submittedByUsername}</p>
        </div>
        <div className={`status-badge ${application.status.toLowerCase()}`}>
          {formatStatus(application.status)}
        </div>
      </div>
      
      <div className="workflow-container">
        {STAGES.map((stage, index) => (
          <div key={stage} className={`workflow-stage ${index === currentStatusIndex ? 'active' : ''} ${index < currentStatusIndex ? 'completed' : ''}`}>
            <div className="workflow-dot"></div>
            <div className="workflow-label">{formatStatus(stage)}</div>
          </div>
        ))}
      </div>

      {statusChangeError && <p className="error-text" style={{ textAlign: 'center' }}>{statusChangeError}</p>}
      
      {isReviewer ? (
        <div className="reviewer-view">
          {renderReviewerActions()}
          <div className="detail-tabs">
            <div className="tab-navigation">
              <button onClick={() => setAdminTab('dossier')} className={adminTab === 'dossier' ? 'active' : ''}>Dossier</button>
              <button onClick={() => setAdminTab('notes')} className={adminTab === 'notes' ? 'active' : ''}>Review Notes</button>
              <button onClick={() => setAdminTab('history')} className={adminTab === 'history' ? 'active' : ''}>History</button>
            </div>
            <div className="tab-content">
              {adminTab === 'dossier' && (
                  <div>
                    <h4>Application Dossier</h4>
                    <p><strong>Description:</strong> {application.description}</p>
                    {/* File list, etc. */}
                  </div>
              )}
              {adminTab === 'notes' && <div><p>Internal review notes placeholder.</p></div>}
              {adminTab === 'history' && <div><p>Application state history placeholder.</p></div>}
            </div>
          </div>
        </div>
      ) : (
        <div className="user-view">
            <div className="detail-card">
              <h3>Application Details</h3>
              <p><strong>Description:</strong> {application.description}</p>
              {application.rejectionReason && (
                <div className="alert alert-warning"><strong>Reason for Amendment:</strong> {application.rejectionReason}</div>
              )}
            </div>
            <div className="detail-card">
                <h3>My Actions</h3>
                {renderUserActions()}
            </div>
        </div>
      )}
    </>
  );
};

export default ApplicationDetail;
