// Navbar.jsx
import React from 'react';
import './HomePage.css';
import logo from './Assets/bg remove logo.png';
import menuIcon from './Assets/ham-menu-icon.png';
import closeIcon from './Assets/close-icon.png';

function Navbar({ isNavbarOpen, toggleNavbar }) {
  return (
    <nav className="navbar">
      <div className="container flex">
        <a href="#home" className="navbar-brand">
          <img src={logo} alt="Logo" />
        </a>
        <button className="hamburger" onClick={toggleNavbar}>
          <img src={isNavbarOpen ? closeIcon : menuIcon} alt="menu" />
        </button>

        <div className={`navbar-collapse ${isNavbarOpen ? 'open' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link" onClick={toggleNavbar}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={toggleNavbar}>
                About
              </a>
            </li>
            {/* Uncomment if you re-enable the Services section */}
            {/* <li className="nav-item">
              <a href="#services" className="nav-link" onClick={toggleNavbar}>Services</a>
            </li> */}
            <li className="nav-item">
              <a href="#doc-panel" className="nav-link" onClick={toggleNavbar}>
                Doctors
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={toggleNavbar}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
