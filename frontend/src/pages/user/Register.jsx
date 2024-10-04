import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!username || !email || !password) {
      setErrorMessage('All fields are required!');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
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

    // Send register request to server
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = '/email-confirmation'; // Redirect on successful registration
        } else {
          setErrorMessage(data.message); // Set error message from server
        }
      })
      .catch((error) => {
        setErrorMessage('An error occurred during registration. Please try again.');
        console.error('Error:', error);
      });
  };

  return (
    <div className="register-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
      <div className="overlay container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="row shadow-lg rounded p-5" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="col-12">
            <form id="sign-up-form" onSubmit={handleSubmit}>
              <h1 className="mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '3rem' }}>Register</h1>
              <div className="mb-3">
                <InputField label="Username" type="text" id="username" placeholder="Username" />
              </div>
              <div className="mb-3">
                <InputField label="Email" type="email" id="email" placeholder="Email" />
              </div>
              <div className="mb-4 position-relative"> {/* Added position-relative for icon positioning */}
                <InputField
                  label="Password"
                  type={passwordVisible ? "text" : "password"} // Toggle input type
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

              <Button text="Sign Up" className="btn btn-golden w-100 rounded-pill mb-3" />
            </form>
            <div id="toggle-container" className="text-center mt-4">
              <p id="toggle-text" className="text-white">Already have an account? <a href="/login"> <strong>Log In</strong></a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
