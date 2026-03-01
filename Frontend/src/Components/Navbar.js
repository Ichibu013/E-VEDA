// Navbar.jsx
import React from 'react';
import '../Styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/bg remove logo.png';
import menuIcon from '../Assets/ham-menu-icon.png';
import closeIcon from '../Assets/close-icon.png';
// import LoginPage from '../Styles/LoginPage.css';

function Navbar({ isNavbarOpen, toggleNavbar }) {
  const navigate = useNavigate();

  const handleProceedClick = () => {
    navigate('/Login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-brand">
          <img src={logo} alt="E-VEDA Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-title">E-VEDA</span>
            <span className="logo-subtitle">Emotion Video & Audio Diagnosis Assistant</span>
          </div>
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
          <li className="nav-item">
            <a href="#features" className="nav-link" onClick={toggleNavbar}>
              Features
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
            <a href="#login" className="nav-link login-btn" onClick={handleProceedClick}>
              Login
            </a>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
