import React, { useState } from 'react';
import '../Styles/LoginPage.css';
import logoImage from '../Assets/bg remove logo.png';
import sideIllustrationImage from '../Assets/emo1.png';

// const logoImage = '/bg remove logo.png';
// const sideIllustrationImage = '/emo1.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login successful (demo)');
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    alert('Account created successfully (demo)');
    setShowSignUp(false);
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
          {/* Only show brand section if NOT on create account */}
          {!showSignUp && (
            <div className="card-brand-section">
              <img src={logoImage} alt="E-VEDA Logo" className="logo-image" />
              <span className="site-name">E-VEDA</span>
            </div>
          )}

          {/* Tagline always visible */}
          <p className="tagline">Emotion Video & Audio Diagnosis Assistant</p>

          {/* Sign Up Form */}
          {showSignUp ? (
            <form onSubmit={handleSignUpSubmit}>
              <h2>Let's Create Account</h2>
              <div className="input-group">
                <label>Enter Your Email</label>
                <input type="email" required />
              </div>
              <div className="input-group">
                <label>Create a Username</label>
                <input type="text" required />
              </div>
              <div className="input-group">
                <label>Create a Password</label>
                <input type="password" required />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" required />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="login-button">
                  Create Account
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowSignUp(false)}
                >
                  &#8592; Back to Login
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
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
                onClick={() => setShowSignUp(true)}
              >
                Create Account / Sign Up
              </button>
            </form>
          )}
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
