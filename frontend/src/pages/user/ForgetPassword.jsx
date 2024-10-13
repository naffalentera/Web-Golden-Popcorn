import React, { useState } from 'react';
import Button from '../../components/Button';

function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement API call to request a password reset here
    
    console.log('Password reset request for:', email);

    // Kirim request ke server untuk reset password
    fetch('http://localhost:5000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Check your email for the password reset link.');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    })
    .catch(error => {
      setMessage('An error occurred. Please try again.');
    });
  };

  return (
    <div className="forget-password-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
            <h2 className="text-white mb-4">Forget Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Reset Password</label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} 
                onChange={(e) => setEmail(e.target.value)} required  />
              </div>
              </div>
              <Button text="Send Reset Link" className="btn btn-golden w-100 rounded-pill mb-3" />
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
