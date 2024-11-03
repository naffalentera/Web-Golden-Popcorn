import React, {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Sidebar() {
  const [activePage, setActivePage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  // Gunakan useEffect untuk memeriksa status login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn menjadi true jika token ada, false jika tidak
  }, []);

  useEffect(() => {
    // Set the active page based on the current URL
    setActivePage(window.location.pathname);
  }, []);

  const handleMenuClick = (page) => {
    setActivePage(page);
  };

  const handleLogoutConfirm = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi, jalankan handleLogoutClick
        handleLogoutClick();
      }
    });
  };
  

  const handleLogoutClick = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo-section d-flex align-items-center mb-4">
      <img src="/images/logo popcorn.png" alt="Logo" style={{ width: '40px', height: '40px' }}/>
            <span className="golden ms-2" style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '28px' }}>Golden</span>
            <span className="popcorn" style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '28px' }}>Popcorn</span>
          
      </div>

      <ul className="menu-list nav-box">
        <li className={`nav-item ${activePage === '/dashboard' ? 'active' : ''}`} onClick={() => handleMenuClick('/dashboard')}>
          <a className="nav-link" href="/dashboard">Dashboard</a>
        </li>

        <li className="nav-item">
          <div className="nav-link" style={{pointerEvents: 'none' }}>Movies</div>
          <ul className="submenu nav" >
            <li style={{ borderBottom: 'none',  paddingBottom: '0px'}} className={`nav-item ${activePage === '/movie-validate' ? 'active' : ''}`} onClick={() => handleMenuClick('/movie-validate')}>
              <a className="nav-link" href="/movie-validate">Validate</a>
            </li>
            <li style={{ borderBottom: 'none',  paddingBottom: '0px' }} className={`nav-item ${activePage === '/movie-input' ? 'active' : ''}`} onClick={() => handleMenuClick('/movie-input')}>
              <a className="nav-link" href="/movie-input">Input New Movie</a>
            </li>
          </ul>
        </li>

        <li className={`nav-item ${activePage === '/countries' ? 'active' : ''}`} onClick={() => handleMenuClick('/countries')}>
          <a className="nav-link" href="/countries">Countries</a>
        </li>
        {/* <li className={`nav-item ${activePage === '/awards' ? 'active' : ''}`} onClick={() => handleMenuClick('/awards')}>
          <a className="nav-link" href="/awards">Awards</a>
        </li> */}
        <li className={`nav-item ${activePage === '/genres' ? 'active' : ''}`} onClick={() => handleMenuClick('/genres')}>
          <a className="nav-link" href="/genres">Genres</a>
        </li>
        <li className={`nav-item ${activePage === '/actor' ? 'active' : ''}`} onClick={() => handleMenuClick('/actor')}>
          <a className="nav-link" href="/actor">Actor</a>
        </li>
        <li className={`nav-item ${activePage === '/comments' ? 'active' : ''}`} onClick={() => handleMenuClick('/comments')}>
          <a className="nav-link" href="/comments">Comments</a>
        </li>
        <li className={`nav-item ${activePage === '/users' ? 'active' : ''}`} onClick={() => handleMenuClick('/users')}>
          <a className="nav-link" href="/users">Users</a>
        </li>
        <li className="nav-item" onClick={handleLogoutConfirm}>
          <a className="nav-link" href="#">Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;