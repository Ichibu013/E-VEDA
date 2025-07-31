import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Ensure this CSS file exists and is linked properly
import doctImage from './Assets/doct.PNG';

function WelcomePage() {
  const navigate = useNavigate();

  const handleProceedClick = () => {
    navigate('/HomePage'); // Corrected route to the login page
  };

  return (
    <div className="landing-container">
      <div className="doctor-image-wrapper">
        <img src={doctImage} alt="Doctor Illustration for E-VEDA" />
      </div>
      <h1 className="welcome-text">Welcome to E-VEDA!</h1>
      <button className="proceed-button" onClick={handleProceedClick}>
        Let's Proceed
      </button>
    </div>
  );
}

export default WelcomePage;
