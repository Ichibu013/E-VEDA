// Navbar.jsx
import React from 'react';
import './HomePage.css';
import logo from './Assets/bg remove logo.png';
import menuIcon from './Assets/ham-menu-icon.png';
import closeIcon from './Assets/close-icon.png';

function Navbar({ isNavbarOpen, toggleNavbar }) {
  return (
    <nav className="navbar">
      <>
        <a href="#home" className="navbar-brand">
          <img src={logo} alt="Logo" />
        </a>
        <button className="hamburger" onClick={toggleNavbar}>
          <img src={isNavbarOpen ? closeIcon : menuIcon} alt="menu" />
        </button>
      </>
      <div className="container flex">
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
            <li className="nav-item">
              <a href="#login" className="nav-link" onClick={toggleNavbar}>
                Login
              </a>
            </li>
            <li className="nav-item">
              <a href="#signup" className="nav-link " onClick={toggleNavbar}>
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
