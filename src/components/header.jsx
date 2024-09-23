import React from 'react';
import Button from './button';
import '../styles/detail.css';

const Header = () => {
  return (
    <header>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{backgroundColor: 'rgba(220, 194, 47, 0.2)', padding: '10px 10px'}}>
        
        <div className="container-fluid">
          {/* Logo */}
          {/* <a className="navbar-brand d-flex align-items-center" href="#"> */}
            <img src="/images/logo popcorn.png" alt="Logo" style={{ width: '40px', height: '40px' }}/>
            <span className="golden ms-2" style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '28px' }}>Golden</span>
            <span className="popcorn" style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '28px' }}>Popcorn</span>
          {/* </a> */}

          {/* Search Bar */}
          <form className="d-flex justify-content-center flex-grow-1">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i> 
              <input
                className="form-control custom-search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
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
              <Button className="watchlist-button ms-3">
                <i className="fas fa-bookmark"></i>
                <span className="ms-2">Watchlist</span>
              </Button>
              
              {/* Sign Up and Log In */}
              <Button className="btn-golden-outline me-2 ms-3" text="Sign Up" />
              <Button className="btn-golden" text="Log In" />
            </div>

            {/* Watchlist and Authentication Buttons for smaller screens */}
            <div className="d-md-none mt-2 w-100">
              <div className="d-grid gap-2">
                <Button className="watchlist-button w-100 mb-2">
                  <i className="fas fa-bookmark"></i>
                  <span className="ms-2">Watchlist</span>
                </Button>
              
                <Button className="btn btn-golden-outline w-100 mb-2" text="Sign Up" />
                <Button className="btn btn-golden w-100" text="Log In" />
              </div>
            </div>
          </div>          
        </div>        
      </nav>
    </header>
  );
};


export default Header;
