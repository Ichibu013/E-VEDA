import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginPage.css';
import logoImage from '../Assets/bg remove logo.png';
import sideIllustrationImage from '../Assets/emo1.png';

// const logoImage = '/bg remove logo.png';
// const sideIllustrationImage = '/emo1.png';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login successful (demo)');
  };


  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    alert('Reset link sent to your email (demo)');
    setShowForgotPassword(false);
  };

  return (
    <div className="page-container">
      <div className="left-panel">
        <div className="ai-doctor-illustration">
          <img src={sideIllustrationImage} alt="AI Doctor Illustration" />
        </div>
      </div>

      <div className="right-panel">
        <div className="login-container">
          <div className="card-brand-section">
            <img src={logoImage} alt="E-VEDA Logo" className="logo-image" />
            <span className="site-name">E-VEDA</span>
          </div>

          {/* Tagline always visible */}
          <p className="tagline">Emotion Video & Audio Diagnosis Assistant</p>

          {/* Login Form */}
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
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </span>
              </div>
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
              <span
                className="forgot-password"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="or-separator">OR</div>

            <button
              type="button"
              className="login-button"
              onClick={() => navigate('/signup')}
            >
              Create Account / Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="signup-modal">
          <div className="modal-content">
            <h2>Reset Using Email</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="input-group">
                <label>Enter your registered Email</label>
                <input type="email" required />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="login-button">
                  Send Reset Link
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
