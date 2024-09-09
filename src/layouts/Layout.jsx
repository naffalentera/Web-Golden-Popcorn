import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom"; // Import Outlet to render nested routes

const Layout = () => {
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Toggle sidebar for mobile

  // Toggle submenu visibility
  const handleToggleSubmenu = () => {
    setIsSubmenuVisible(!isSubmenuVisible);
  };

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Hamburger Menu for mobile */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          aria-controls="sidebarMenu"
          aria-expanded={isSidebarVisible ? "true" : "false"}
          aria-label="Toggle sidebar"
          onClick={handleToggleSidebar}
        >
          <FaList />
        </button>

        {/* Sidebar */}
        <nav
          id="sidebarMenu"
          className={`col-md-3 col-lg-2 d-md-block bg-light sidebar collapse ${
            isSidebarVisible ? "show" : ""
          } vh-100`}
        >
          <div className="position-sticky">
            <ul className="nav flex-column">
              {/* Dramas with Submenu */}
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link text-dark"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleSubmenu();
                  }}
                >
                  Dramas
                </a>
                {isSubmenuVisible && (
                  <ul className="nav flex-column ms-3">
                    <li className="nav-item">
                      <Link className="nav-link text-dark" to="/drama">
                        Validate
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-dark" to="/new-drama">
                        Input New Drama
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/countries">
                  Countries
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/awards">
                  Awards
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/genres">
                  Genres
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/actor">
                  Actors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/comments">
                  Comments
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/users">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <Outlet /> {/* This is where the nested components (Drama, Actor) will render */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
