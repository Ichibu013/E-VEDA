import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WelcomePage.css';
import '../Styles/HomePage.css';
import logoImage from '../Assets/bg remove logo.png';

function WelcomePage() {
  const navigate = useNavigate();

  const handleProceedClick = () => {
    navigate('/homepage');
  };

  return (
    <div className="landing-container">
      <div className="welcome-logo-section">
        <div className="welcome-logo-wrapper">
          <img src={logoImage} alt="E-VEDA Logo" className="welcome-logo" />
          <div className="welcome-logo-text">
            <span className="welcome-logo-title">E-VEDA</span>
            <span className="welcome-logo-subtitle">Emotion Video & Audio Diagnosis Assistant</span>
          </div>
        </div>
      </div>
      <div className="welcome-content">
        <h1 className="welcome-text">E-VEDA</h1>
        <p className="welcome-description">
          Emotion Video & Audio Diagnosis Assistant - Your trusted healthcare companion for comprehensive health monitoring and expert medical consultations.
        </p>
        <button className="proceed-button" onClick={handleProceedClick}>
          Let's Proceed
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
