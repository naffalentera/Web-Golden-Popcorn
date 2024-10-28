import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Button from './Button';
import '../styles/style.css';

const Header = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  // Gunakan useEffect untuk memeriksa status login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = sessionStorage.getItem('UserToken');
    setIsLoggedIn(!!token); // Set isLoggedIn menjadi true jika token ada, false jika tidak
  }, []);

  

  useEffect(() => {
    const token = sessionStorage.getItem('UserToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Mendekode token
        console.log("Decoded Token:", decodedToken);
        setUsername(decodedToken.username); // Ambil username dari payload token
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Navigate to the SearchPage with the search keyword in the URL
      navigate(`/search?query=${searchInput}`);
    }
  };

  const handleLoginClick = () => {
    // Navigate to the Login Page
    navigate('/login');
  };

  const handleSignUpClick = () => {
    // Navigate to the Register Page
    navigate('/register');
  };

  const handleWatchlistClick = () => {
    if (isLoggedIn) {
      // Navigate to Watchlist Page if user is logged in
      navigate('/watchlist');
    } else {
      // Navigate to Login Page if user is not logged in
      navigate('/login');
    }
  };

  const handleLogoutClick = () => {
    // Log out the user by clearing the token and navigating to home or login page
    sessionStorage.removeItem('UserToken');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/home');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <header>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{ backgroundColor: 'rgba(220, 194, 47, 0.2)', padding: '10px 10px' }}>

        <div className="container-fluid">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
            <img src="/images/logo popcorn.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
            <span className="golden ms-2" style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '28px' }}>Golden</span>
            <span className="popcorn" style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '28px' }}>Popcorn</span>
          </a>

          {/* Search Bar */}
          <form className="d-flex justify-content-center flex-grow-1" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                className="form-control custom-search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>

          {/* Navbar Toggler */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Navbar */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Buttons for larger screens */}
            <div className="d-none d-md-flex align-items-center ms-auto">
              {/* Watchlist Button */}
              <Button className="watchlist-button ms-3" onClick={handleWatchlistClick}>
                <i className="fas fa-bookmark"></i>
                <span className="ms-2">Watchlist</span>
              </Button>

              {/* Check if user is logged in */}
              {isLoggedIn ? (
                // If logged in, show user avatar and dropdown menu
                <div className="dropdown ms-3">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                    <i className="fas fa-user-circle fa-2x"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li className="dropdown-item">Username: {username}</li> 
                    <li><button className="dropdown-item" onClick={handleLogoutClick}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                // If not logged in, show Sign Up and Log In buttons
                <>
                  <Button className="btn-golden-outline me-2 ms-3" text="Sign Up" onClick={handleSignUpClick} />
                  <Button className="btn-golden" text="Log In" onClick={handleLoginClick} />
                </>
              )}
            </div>

            {/* Watchlist and Authentication Buttons for smaller screens */}
            <div className="d-md-none mt-2 w-100">
              <div className="d-grid gap-2">
                <Button className="watchlist-button w-100 mb-2" onClick={handleWatchlistClick}>
                  <i className="fas fa-bookmark"></i>
                  <span className="ms-2">Watchlist</span>
                </Button>

                {isLoggedIn ? (
                  // User avatar for smaller screens
                  <div className="dropdown w-100 mb-2">
                    <button
                      className="btn btn-secondary dropdown-toggle w-100"
                      type="button"
                      id="dropdownMenuButtonMobile"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <i className="fas fa-user-circle fa-2x"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonMobile">
                      <li className="dropdown-item">Username: {username}</li>
                      <li><button className="dropdown-item" onClick={handleLogoutClick}>Logout</button></li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Button className="btn btn-golden-outline w-100 mb-2" text="Sign Up" onClick={handleSignUpClick} />
                    <Button className="btn btn-golden w-100" text="Log In" onClick={handleLoginClick} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
