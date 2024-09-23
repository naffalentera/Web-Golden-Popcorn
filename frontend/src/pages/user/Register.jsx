import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';


function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
          <form id="sign-up-form">
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

            <Button text="Sign Up" className="btn btn-golden w-100 rounded-pill mb-3" />
            <div className="text-center text-white mb-3">OR</div>
            <Button className="btn btn-light w-100 rounded-pill mb-2 d-flex align-items-center justify-content-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" style={{ width: '20px' }} className="me-2" />
              Sign up with Google
            </Button>
          </form>
          <div id="toggle-container" className="text-center mt-4">
            <p id="toggle-text" className="text-white">Already have an account? <a href="/login"><strong>Log In</strong></a></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default RegisterPage;
