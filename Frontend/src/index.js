import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App'; // Import the RootApp component
import './index.css'; // Import global styles
import WelcomePage from './WelcomePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootApp />
    <WelcomePage />
    {/* <HomePage /> */}
  </React.StrictMode>
);
