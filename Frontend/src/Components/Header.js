import React, { useState } from 'react';
// import myImage from '../assets/my-transparent.png'; // Assuming you have a transparent version of your image

function Header() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <header className="header bg-blue">
      <nav className="navbar bg-blue">
        <div className="container flex">
          <a href="index.html" className="navbar-brand">
            <img src="../Assets/logo.png" alt="site logo" />
          </a>
          <button
            type="button"
            className="navbar-show-btn"
            onClick={toggleNavbar}
          >
            <img src="../Assets/ham-menu-icon.png" alt="menu" />
          </button>

          <div
            className={`navbar-collapse bg-white ${
              isNavbarOpen ? 'show-navbar' : ''
            }`}
          >
            <button
              type="button"
              className="navbar-hide-btn"
              onClick={toggleNavbar}
            >
              <img src="../Assets/close-icon.png" alt="close" />
            </button>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Service
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Doctors
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Departments
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
            <div className="search-bar">
              <form>
                <div className="search-bar-box flex">
                  <span className="search-icon flex">
                    <img src="../Assets/search-icon-dark.png" alt="search" />
                  </span>
                  <input
                    type="search"
                    className="search-control"
                    placeholder="Search here"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="header-inner text-white text-center">
        <div className="container grid">
          <div className="header-inner-left">
            <h1>
              your most trusted
              <br /> <span>health partner</span>
            </h1>
            <p className="lead">the best match services for you</p>
            <p className="text text-md">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam,
              nulla odit esse necessitatibus corporis voluptatem?
            </p>
            <div className="btn-group">
              <a href="#" className="btn btn-white">
                Learn More
              </a>
              <a href="#" className="btn btn-light-blue">
                Sign In
              </a>
            </div>
          </div>
          <div className="header-inner-right">
            {/* Use the imported image here */}
            {/* <img src={myImage} alt="Your Profile" className="profile-image" /> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
