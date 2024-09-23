import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'rgba(220, 194, 47, 0.2)',
        padding: '10px 0px',
      }}
    >
      <div className="container-fluid px-4">
        <div className="row justify-content-between align-items-center">
          {/* Left Section: Site Info */}
          <div className="col-md-4 d-flex align-items-center">
            {/* Logo */}
            <img src="/images/logo popcorn.png" alt="Logo" style={{ width: '60px', height: '60px', marginRight: '10px' }}/>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div >
                <span className="golden" style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '24px' }}>Golden</span>
                <span className="popcorn" style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '24px' }}>Popcorn</span>
              </div>
              <p style={{ margin: 0 }}>Website berisi review film seluruh dunia</p>
            </div>
          </div>

          {/* Center Section: Copyright */}
          <div className="col-md-4 text-center" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
            <p style={{ margin: 0 }}>Copyright ©2024. All Rights Reserved. TIRANA.</p>
          </div>

          {/* Right Section: GitHub Icon */}
          {/* <div className="col-md-4 text-md-end text-center">
            <a
              href="https://github.com/RahmaDivina/Web-Golden-Popcorn"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FFFFFF', textDecoration: 'GitHub' }}
            >
              <i className="fab fa-github fa-2x"></i>
            </a>
            <p style={{ marginTop: '5px', marginBottom: '0', color: '#C6A628' }}>
              Check out our GitHub repository!
            </p>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
