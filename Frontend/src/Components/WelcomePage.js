import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WelcomePage.css';
import doctImage from '../Assets/doct.PNG';
import '../Styles/HomePage.css';

function WelcomePage() {
  const navigate = useNavigate();

  const handleProceedClick = () => {
    navigate('/homepage');
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
