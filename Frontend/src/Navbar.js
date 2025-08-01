import React from 'react';
import './HomePage.css'; // Use the same CSS file for styling
import logo from './Assets/bg remove logo.png';
import menuIcon from './Assets/ham-menu-icon.png';
import closeIcon from './Assets/close-icon.png';
import searchIcon from './Assets/search-icon-dark.png';

const Navbar = ({ isNavbarOpen, toggleNavbar }) => {
  return (
    <nav className="navbar bg-blue">
      <div className="container flex">
        <a href="#home" className="navbar-brand">
          <img src={logo} alt="site logo" />
        </a>
        <button
          type="button"
          className="navbar-show-btn"
          onClick={toggleNavbar}
        >
          <img src={menuIcon} alt="menu" />
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
            <img src={closeIcon} alt="close" />
          </button>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="#services" className="nav-link">
                Service
              </a>
            </li>
            <li className="nav-item">
              <a href="#doc-panel" className="nav-link">
                Doctors
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link">
                Contact
              </a>
            </li>
          </ul>
          <div className="search-bar">
            <form>
              <div className="search-bar-box flex">
                <span className="search-icon flex">
                  <img src={searchIcon} alt="search" />
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
  );
};

export default Navbar;
