import React, { useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom'; 

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
      return;
    }

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Send request to reset password
    fetch('http://localhost:5000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, email, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Password reset successfully!');
        navigate('/login');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    })
    .catch(error => {
      setMessage('An error occurred. Please try again.');
    });
  };

  return (
    <div className="reset-password-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background Image */}
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

      {/* Overlay for the form */}
      <div className="overlay container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div 
          className="row shadow-lg rounded p-5"
          style={{ 
            maxWidth: '500px', 
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          }}
        >
          <div className="col-12">
            <h2 className="text-white mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <input
                    type={passwordVisible ? "text" : "password"} // Toggle input type
                    className="form-control"
                    id="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      top: '50%', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#6c757d'
                    }}
                  >
                    <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i> {/* Font Awesome Icons */}
                  </span>
                </div>

                <div className="mb-3 position-relative">
                  <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"} // Toggle input type
                    className="form-control"
                    id="confirm-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Toggle visibility
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      top: '50%', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#6c757d',
                    }}
                  >
                    <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i> {/* Font Awesome Icons */}
                  </span>
                </div>
                {message && <p className="text-danger mt-2">{message}</p>}
              <Button text="Reset Password" className="btn btn-golden w-100 rounded-pill mb-3" />
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
