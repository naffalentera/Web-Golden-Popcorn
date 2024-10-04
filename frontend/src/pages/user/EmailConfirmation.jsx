import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

function EmailConfirmationPage() {
  const [status, setStatus] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah route saat ini adalah "/verify-email"
    if (location.pathname === '/verify-email') {
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      if (token) {
        fetch(`http://localhost:5000/api/verify-email?token=${token}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setStatus('Email verification successful! You can now log in.');
            } else {
              setStatus('Invalid or expired token.');
            }
          })
          .catch(() => {
            setStatus('An error occurred while verifying your email.');
          });
      } else {
        setStatus('Invalid request.');
      }
    } else {
      // Jika route adalah "/email-confirmation"
      setStatus('Check your inbox, we already sent an email.');
    }
  }, [location]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="email-confirmation-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div 
        style={{
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: 'blur(5px)',
          zIndex: -1,
        }}
      />

      <div className="overlay container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div 
          className="row shadow-lg rounded p-5"
          style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div className="col-12">
            <h2 className="text-white mb-4">Email Confirmation</h2>
            <p className="text-white">{status}</p>
            {status.includes('successful') && (
              <Button text="Go to login page" className="btn btn-golden w-100 rounded-pill mb-3" onClick={handleLoginClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmationPage;
