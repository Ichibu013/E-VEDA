import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // All imports at the top
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Add more routes here if needed */}
        </Routes>
    );
}

// RootApp wraps the main App component with BrowserRouter
function RootApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RootApp;