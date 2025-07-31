import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Component-specific styles

// Assuming doct.PNG is in your public folder
const doctImage = '/doct.PNG';

function WelcomePage() {
    const navigate = useNavigate();

    const handleProceedClick = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="landing-container">
            <div className="doctor-image-wrapper">
                <img src={doctImage} alt="AI Doctor Illustration" />
            </div>
            <h1 className="welcome-text">Welcome to E-VEDA!</h1>
            <button className="proceed-button" onClick={handleProceedClick}>
                Let's Proceed
            </button>
        </div>
    );
}

export default WelcomePage;