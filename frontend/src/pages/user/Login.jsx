import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function LoginPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
  
    const handleLogin = (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      

      // Basic validation
      if (!username || !password) {
          setErrorMessage('All fields are required!');
          return;
        } 
      
      // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
      if (!passwordPattern.test(password)) {
        setErrorMessage(
        'Password must be at least 8 characters long, contain uppercase letter, lowercase letter, number, and special character.'
        );
        return;
        }

      // Clear any previous error message
      setErrorMessage('');
  
      fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            sessionStorage.setItem('token', data.token); // Simpan JWT token
            if (data.role === 'admin') {
                window.location.href = 'http://localhost:3000/dashboard'; // Redirect ke dashboard admin
              } else {
                window.location.href = `http://localhost:3000/home?token=${data.token}`; // Redirect ke halaman home untuk user biasa
              }
          } else {
            setErrorMessage(data.message); // Tampilkan pesan error jika login gagal
          }
        })
        .catch((error) => {
          setErrorMessage('An error occurred. Please try again.');
          console.error('Error during login:', error);
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google'; // Arahkan ke rute Google OAuth di backend
  };
  
  return (
    <div className="login-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
          zIndex: -1, // Places the background behind the form
        }}
      />
      
      {/* Overlay for the form */}
      <div className="overlay container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="row shadow-lg rounded p-5" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <div className="col-12">
            <form id="log-in-form" onSubmit={handleLogin}>
              <h1 className="mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '3rem' }}>Log In</h1>
              <div className="mb-3"> 
                <InputField label="Username" type="text" id="username" placeholder="Username" />
              </div>
              
              <div className="mb-4 position-relative">
                <InputField
                  label="Password"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%',  
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6c757d',
                  }}
                >
                  <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i> 
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>} {/* Error message below password */}

              <div className="d-flex justify-content-between mb-3">
                <a href="/forget-password" className='text-white'>Forgot password?</a>
              </div>
              
              {/* Log In Button */}
              <Button text="Log In" className="btn btn-golden w-100 rounded-pill mb-3"/>
            </form>

              <div className="text-center text-white mb-3">OR</div>
              {/* Social Media Buttons */}
              <Button className="btn btn-light w-100 rounded-pill mb-2 d-flex align-items-center justify-content-center" onClick={handleGoogleLogin} >
                <img src="/images/google_logo.png" alt="Google" style={{ width: '20px' }} className="me-2" />
                Log in with Google
              </Button> 
                <div id="toggle-container" className="text-center mt-4">
              <p id="toggle-text" className="text-white">Don't have an account? <a href="/register"><strong>Register</strong></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
