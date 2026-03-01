import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';
import user1Image from '../Assets/user1.png';
import dashm1Image from '../Assets/dashm 1.png';
import doct1Image from '../Assets/doct 1.png';
import doct2Image from '../Assets/doct 2.png';
import heightIcon from '../Assets/height 1.png';
import weightIcon from '../Assets/weight 1.png';
import homeIcon from '../Assets/Home.png';
import newReportIcon from '../Assets/new report.png';
import historyIcon from '../Assets/history.png';
import settingIcon from '../Assets/setting.png';
import NewReport from './NewReport';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [currentPage, setCurrentPage] = useState('home');

  // Close sidebar when navigating to new-report page
  useEffect(() => {
    if (currentPage === 'new-report') {
      setSidebarOpen(false);
    }
  }, [currentPage]);

  // Graph data matching the screenshot
  const emotionData = [
    { time: 0, joy: 38, anger: 28, nervousness: 35, sadness: 25 },
    { time: 5, joy: 55, anger: 45, nervousness: 42, sadness: 22 },
    { time: 8, joy: 75, anger: 55, nervousness: 50, sadness: 18 },
    { time: 9, joy: 72, anger: 60, nervousness: 48, sadness: 15 },
    { time: 10, joy: 70, anger: 68, nervousness: 46, sadness: 18 },
    { time: 12, joy: 78, anger: 58, nervousness: 44, sadness: 35 },
    { time: 13, joy: 80, anger: 60, nervousness: 45, sadness: 32 },
    { time: 14, joy: 82, anger: 65, nervousness: 47, sadness: 10 },
    { time: 15, joy: 85, anger: 70, nervousness: 48, sadness: 38 },
    { time: 16, joy: 87, anger: 80, nervousness: 49, sadness: 36 },
    { time: 17, joy: 88, anger: 78, nervousness: 50, sadness: 35 },
    { time: 18, joy: 89, anger: 75, nervousness: 51, sadness: 34 },
    { time: 19, joy: 90, anger: 50, nervousness: 52, sadness: 35 },
    { time: 20, joy: 91, anger: 48, nervousness: 50, sadness: 35 },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="hamburger-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span className="header-title">E-VEDA</span>
        </div>
        <div className="header-right">
          <button className="notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <select 
            className="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </header>

      <div className="dashboard-content-wrapper">
        {/* Left Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              <img src={homeIcon} alt="Home" className="nav-icon" />
              <span>Home</span>
            </button>
            <button 
              className={`nav-item ${currentPage === 'new-report' ? 'active' : ''}`}
              onClick={() => setCurrentPage('new-report')}
            >
              <img src={newReportIcon} alt="New Report" className="nav-icon" />
              <span>New Report</span>
            </button>
            <button className="nav-item">
              <img src={historyIcon} alt="History" className="nav-icon" />
              <span>History</span>
            </button>
            <button className="nav-item">
              <img src={settingIcon} alt="Settings" className="nav-icon" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {currentPage === 'new-report' ? (
            <NewReport />
          ) : (
            <div className="dashboard-home-content">
          {/* User Greeting Section */}
          <section className="greeting-section animate-fade-in">
            <div className="greeting-content">
              <h1 className="greeting-title">
                Hello, <span className="greeting-name">Srushti Shinde</span>.
              </h1>
              <p className="greeting-message">
                It looks like you have not completed your exercise today.
              </p>
              <button className="view-history-btn">
                View History
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <div className="daily-goals-card animate-slide-up">
                <div className="goal-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Daily Goals: Exercise 30 min.</span>
                </div>
                <div className="goal-item">
                  <span>Also, meditate regularly.</span>
                </div>
              </div>
            </div>
            <div className="doctor-illustration-main animate-fade-in-right">
              <img src={dashm1Image} alt="Doctor" />
            </div>
          </section>

          {/* Line Graph Section */}
          <section className="graph-section animate-fade-in">
            <div className="graph-container">
              <div className="graph-left-section">
                <h2 className="section-title">Line Graph Indicating Emotional Trends Over Time</h2>
                <div className="graph-doctor-illustration animate-fade-in-left">
                  <img src={doct1Image} alt="Doctor with Tablet" />
                </div>
              </div>
              <div className="graph-wrapper">
                <svg className="emotion-graph" viewBox="0 0 500 370">
                  {/* Y-axis */}
                  <line x1="60" y1="30" x2="60" y2="320" stroke="#ccc" strokeWidth="2" />
                  {/* X-axis */}
                  <line x1="60" y1="320" x2="460" y2="320" stroke="#ccc" strokeWidth="2" />
                  
                  {/* Y-axis label - Intensity (%) */}
                  <text x="15" y="175" textAnchor="middle" fontSize="12" fill="#666" fontWeight="500" transform="rotate(-90 15 175)">
                    Intensity (%)
                  </text>
                  
                  {/* Y-axis labels - matching screenshot: 0, 20, 30, 40, 60, 80, 100 */}
                  {[0, 20, 30, 40, 60, 80, 100].map((val, idx) => {
                    const yPos = 320 - (val * 2.9);
                    return (
                      <g key={idx}>
                        <line x1="55" y1={yPos} x2="60" y2={yPos} stroke="#ccc" strokeWidth="1" />
                        <text x="50" y={yPos + 5} textAnchor="end" fontSize="11" fill="#666" fontWeight="500">
                          {val}%
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* X-axis labels - 0 to 20 minutes */}
                  {[0, 5, 10, 15, 20].map((val, idx) => {
                    const xPos = 60 + (val * 20);
                    return (
                      <g key={idx}>
                        <line x1={xPos} y1="320" x2={xPos} y2="325" stroke="#ccc" strokeWidth="1" />
                        <text x={xPos} y="338" textAnchor="middle" fontSize="11" fill="#666" fontWeight="500">
                          {val}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* X-axis label - Time (minutes) - centered below the axis */}
                  <text x="260" y="350" textAnchor="middle" fontSize="12" fill="#666" fontWeight="500">
                    Time (minutes)
                  </text>
                  
                  {/* Graph lines with animation */}
                  <polyline
                    points={emotionData.map(d => `${60 + (d.time * 20)},${320 - (d.joy * 2.9)}`).join(' ')}
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="3"
                    className="graph-line graph-line-joy"
                  />
                  <polyline
                    points={emotionData.map(d => `${60 + (d.time * 20)},${320 - (d.anger * 2.9)}`).join(' ')}
                    fill="none"
                    stroke="#f44336"
                    strokeWidth="3"
                    className="graph-line graph-line-anger"
                  />
                  <polyline
                    points={emotionData.map(d => `${60 + (d.time * 20)},${320 - (d.nervousness * 2.9)}`).join(' ')}
                    fill="none"
                    stroke="#ffc107"
                    strokeWidth="3"
                    className="graph-line graph-line-nervousness"
                  />
                  <polyline
                    points={emotionData.map(d => `${60 + (d.time * 20)},${320 - (d.sadness * 2.9)}`).join(' ')}
                    fill="none"
                    stroke="#2196f3"
                    strokeWidth="3"
                    className="graph-line graph-line-sadness"
                  />
                </svg>
                <div className="graph-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#4caf50' }}></span>
                    <span>Joy</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#f44336' }}></span>
                    <span>Anger</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
                    <span>Nervousness</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#2196f3' }}></span>
                    <span>Sadness</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Model Accuracy Section */}
          <section className="accuracy-section animate-fade-in">
            <div className="accuracy-grid">
              {[
                { title: 'Face Model Accuracy', value: 65 },
                { title: 'Voice Model Accuracy', value: 65 },
                { title: 'Gesture Model Accuracy', value: 65 },
                { title: 'Eye Model Accuracy', value: 65 },
              ].map((model, idx) => (
                <div key={idx} className="accuracy-card animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3 className="accuracy-title">{model.title}</h3>
                  <div className="accuracy-circle">
                    <svg className="progress-ring" width="80" height="80">
                      <circle
                        className="progress-ring-background"
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="6"
                      />
                      <circle
                        className="progress-ring-progress"
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="#1976d2"
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - model.value / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <span className="accuracy-value">{model.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Insight Section */}
          <section className="insight-section animate-fade-in">
            <div className="insight-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-2 4.5-2 7h-8c0-2.5-2-4.5-2-7a6 6 0 0 1 6-6z"></path>
                <line x1="12" y1="11" x2="12" y2="13"></line>
              </svg>
              <span className="insight-text">
                Insight: High 'Sadness' correlates low heart rate and disrupted sleep.
              </span>
            </div>
          </section>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        {currentPage !== 'new-report' && (
        <aside className="right-sidebar">
          {/* User Profile Card */}
          <div className="sidebar-profile-card animate-fade-in">
            <img src={user1Image} alt="User" className="sidebar-profile-pic animate-scale-in" />
            <div className="sidebar-profile-info animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="sidebar-profile-name">Steven Fernandes</span>
              <span className="sidebar-profile-age">22 Years</span>
            </div>
          </div>

          {/* Emotion Calculator */}
          <div className="emotion-calculator animate-fade-in">
            <div className="calculator-header">
              <h3>Emotion Calculator</h3>
              <select className="calculator-date-select">
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last Year</option>
              </select>
            </div>
              <div className="emotion-circles">
              <div className="emotion-circle happy-blue animate-bounce-in">
                <div className="circle-content">
                  <span className="emotion-label">Happy</span>
                  <span className="emotion-percentage">92%</span>
                </div>
              </div>
              <div className="emotion-circle sad-red animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                <div className="circle-content">
                  <span className="emotion-label">Sad</span>
                  <span className="emotion-percentage">52%</span>
                </div>
              </div>
            </div>
            <div className="physical-measurements">
              <div className="measurement-item animate-slide-in-right">
                <img src={heightIcon} alt="Height" className="measurement-icon" />
                <span>Height 172 cm</span>
              </div>
              <div className="measurement-item animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <img src={weightIcon} alt="Weight" className="measurement-icon" />
                <span>Weight 47 KG</span>
              </div>
            </div>
          </div>

          {/* Doctor Illustration */}
          <div className="doctor-emotion-section animate-fade-in">
            <div className="doctor-illustration-sidebar animate-fade-in-left">
              <img src={doct2Image} alt="Doctor" />
            </div>
            <div className="emotion-bubbles">
              <div className="emotion-bubble animate-bounce-in">Emotion 1</div>
              <div className="emotion-bubble animate-bounce-in" style={{ animationDelay: '0.2s' }}>Emotion 2</div>
              <div className="emotion-bubble animate-bounce-in" style={{ animationDelay: '0.4s' }}>Emotion 3</div>
            </div>
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
