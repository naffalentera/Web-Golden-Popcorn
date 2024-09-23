import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function PasswordResetPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement API call to request a password reset here
    console.log('Password reset request for:', email);
  };

  return (
    <div className="password-reset-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
            <h2 className="text-white mb-4">Reset Your Password</h2>
            <p>We will send you an email to reset your password.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <InputField 
                  label="Email Address" 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <Button text="Send Reset Link" className="btn btn-golden w-100 rounded-pill mb-3" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
