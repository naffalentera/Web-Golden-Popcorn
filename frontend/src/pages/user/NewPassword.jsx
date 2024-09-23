import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom'; // If using react-router for params

function NewPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { token } = useParams(); // Extract the token from the URL

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Implement API call to reset password here
    console.log('Resetting password with token:', token);
  };

  return (
    <div className="new-password-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
            <h2 className="text-white mb-4">Set a New Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <InputField 
                  label="New Password" 
                  type={passwordVisible ? "text" : "password"} // Toggle input type
                  id="password" 
                  placeholder="Enter your new password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6c757d',
                  }}
                >
                  <i className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i> {/* Font Awesome Icons */}
                </span>
              </div>
              <div className="mb-4 position-relative">
                <InputField 
                  label="Confirm New Password" 
                  type={confirmPasswordVisible ? "text" : "password"} // Toggle input type
                  id="confirm-password" 
                  placeholder="Confirm your new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                />
                <span
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6c757d',
                  }}
                >
                  <i className={`fas ${confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i> {/* Font Awesome Icons */}
                </span>
              </div>
              <Button text="Reset Password" className="btn btn-golden w-100 rounded-pill mb-3" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPasswordPage;
