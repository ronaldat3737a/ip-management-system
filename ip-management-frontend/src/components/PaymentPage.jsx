import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getApplicationById, updateApplicationStatus } from '../services/api';
import '../styles/Form.css';
import '../styles/Buttons.css';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getApplicationById(id)
      .then(res => setApplication(res.data))
      .catch(() => setError('Failed to fetch application.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async () => {
    try {
      // In a real app, this would integrate with a payment gateway.
      // Here, we'll just simulate a successful payment and update the status.
      await updateApplicationStatus(id, { status: 'FEE_PAYMENT_AND_GRANT' });
      alert('Payment Successful! The patent will now be granted.');
      navigate(`/applications/${id}`);
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="form-container">
      <div className="back-link-container">
        <Link to={`/applications/${id}`} className="back-link">← Back to Details</Link>
      </div>
      <h2>Patent Fee Payment</h2>
      {application && (
        <div className="review-section">
          <h4>Application: {application.title}</h4>
          <p><strong>ID:</strong> {application.id}</p>
          <hr />
          <p>Granting Fee: <strong>$100.00</strong></p>
          <p>Registration Fee: <strong>$50.00</strong></p>
          <p>Publication Fee: <strong>$25.00</strong></p>
          <hr />
          <p><strong>Total: $175.00</strong></p>
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <h4>Select Payment Method:</h4>
        {/* Placeholder for payment methods */}
        <div>
            <input type="radio" id="momo" name="payment" value="momo" checked readOnly />
            <label htmlFor="momo"> Momo</label>
        </div>
        <div>
            <input type="radio" id="vnpay" name="payment" value="vnpay" />
            <label htmlFor="vnpay"> VNPay</label>
        </div>
         <div>
            <input type="radio" id="banking" name="payment" value="banking" />
            <label htmlFor="banking"> Banking</label>
        </div>
      </div>
      <button onClick={handlePayment} className="button-success" style={{ width: '100%', marginTop: '2rem' }}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
