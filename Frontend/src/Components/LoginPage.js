import React, { useState } from 'react';
import './LoginPage.css'; // Make sure this CSS file exists
import logoImage from './Assets/bg remove logo.png';
import sideIllustrationImage from './Assets/emo1.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add actual login logic here (API call, etc.)
    console.log('Login attempt:', { username, password, rememberMe });
    alert('Login functionality not implemented in this demo.');
  };

  return (
    <div className="page-container">
      {/* Left Panel - Image or Illustration */}
      <div className="left-panel">
        <div className="ai-doctor-illustration">
          <img src={sideIllustrationImage} alt="Illustration of AI Doctor" />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="right-panel">
        <div className="login-container">
          <div className="card-brand-section">
            <img src={logoImage} alt="E-VEDA Logo" className="logo-image" />
            <span className="site-name">E-VEDA</span>
          </div>
          <p className="tagline">Emotion Video & Audio Diagnosis Assistant</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username / Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options-group">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <a
                href="#"
                className="forgot-password"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
