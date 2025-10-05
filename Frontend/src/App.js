import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './LoginPage';
import WelcomePage from './Components/WelcomePage';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage'; // Adjust if path is different

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

      {/* Add more routes here if needed */}
    </Routes>
  );
}

function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default RootApp;
