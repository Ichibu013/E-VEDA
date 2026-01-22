import React, { useState, useRef } from 'react';
import '../Styles/NewReport.css';
import doct2Image from '../Assets/doct 2.png';

function NewReport() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState('Ready');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceRecognitionStatus, setVoiceRecognitionStatus] = useState('Ready');
  const [medicalData, setMedicalData] = useState({
    heartRate: '--',
    bloodPressure: '--',
    temperature: '--',
    oxygenLevel: '--',
    stressLevel: '--',
  });
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecognitionStatus('Analyzing...');
    // Simulate facial recognition process
    setTimeout(() => {
      setRecognitionStatus('Recognized');
      setMedicalData({
        heartRate: '72 bpm',
        bloodPressure: '120/80',
        temperature: '98.6°F',
        oxygenLevel: '98%',
        stressLevel: 'Low',
      });
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecognitionStatus('Stopped');
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecognitionStatus('Ready');
    setMedicalData({
      heartRate: '--',
      bloodPressure: '--',
      temperature: '--',
      oxygenLevel: '--',
      stressLevel: '--',
    });
  };

  const handleStartVoiceRecording = () => {
    setIsVoiceRecording(true);
    setVoiceRecognitionStatus('Analyzing...');
    // Simulate voice recognition process
    setTimeout(() => {
      setVoiceRecognitionStatus('Recognized');
    }, 2000);
  };

  const handleStopVoiceRecording = () => {
    setIsVoiceRecording(false);
    setVoiceRecognitionStatus('Stopped');
  };

  const handleResetVoice = () => {
    setIsVoiceRecording(false);
    setVoiceRecognitionStatus('Ready');
  };

  return (
    <div className="new-report-container">
      <div className="report-header">
        <h1 className="report-title">New Medical Report</h1>
        <p className="report-subtitle">Facial Recognition, Voice Recognition & Medical Analysis</p>
      </div>

      <div className="report-content">
        {/* Recognition Sections */}
        <div className="recognition-sections">
          {/* Facial Recognition Section */}
          <section className="recognition-section">
            <h2 className="section-heading">Facial Recognition</h2>
            <div className="recognition-box">
              <div className="video-container">
                <div className="video-placeholder">
                  {isRecording ? (
                    <div className="recording-indicator">
                      <div className="recording-dot"></div>
                      <span>Recording...</span>
                    </div>
                  ) : (
                    <div className="camera-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                    </div>
                  )}
                  <video ref={videoRef} className="recognition-video" autoPlay playsInline></video>
                </div>
                <div className="recognition-status">
                  <span className={`status-badge ${recognitionStatus.toLowerCase()}`}>
                    {recognitionStatus}
                  </span>
                </div>
              </div>
              <div className="recognition-controls">
                {!isRecording ? (
                  <button className="control-btn start-btn" onClick={handleStartRecording}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    Start Recognition
                  </button>
                ) : (
                  <button className="control-btn stop-btn" onClick={handleStopRecording}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <rect x="9" y="9" width="6" height="6"></rect>
                    </svg>
                    Stop Recording
                  </button>
                )}
                <button className="control-btn reset-btn" onClick={handleReset}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Voice Recognition Section */}
          <section className="recognition-section">
            <h2 className="section-heading">Voice Recognition</h2>
            <div className="recognition-box">
              <div className="video-container">
                <div className="video-placeholder">
                  {isVoiceRecording ? (
                    <div className="recording-indicator">
                      <div className="recording-dot"></div>
                      <span>Recording Voice...</span>
                    </div>
                  ) : (
                    <div className="camera-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </div>
                  )}
                  <audio ref={audioRef} className="recognition-video" autoPlay></audio>
                </div>
                <div className="recognition-status">
                  <span className={`status-badge ${voiceRecognitionStatus.toLowerCase()}`}>
                    {voiceRecognitionStatus}
                  </span>
                </div>
              </div>
              <div className="recognition-controls">
                {!isVoiceRecording ? (
                  <button className="control-btn start-btn" onClick={handleStartVoiceRecording}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    Start Recognition
                  </button>
                ) : (
                  <button className="control-btn stop-btn" onClick={handleStopVoiceRecording}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <rect x="9" y="9" width="6" height="6"></rect>
                    </svg>
                    Stop Recording
                  </button>
                )}
                <button className="control-btn reset-btn" onClick={handleResetVoice}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Medical Requirements Section */}
        <section className="medical-requirements-section">
          <h2 className="section-heading">Medical Requirements & Analysis</h2>
          <div className="medical-grid">
            {/* Vital Signs */}
            <div className="medical-card">
              <div className="card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>Vital Signs</h3>
              </div>
              <div className="vital-signs">
                <div className="vital-item">
                  <span className="vital-label">Heart Rate</span>
                  <span className="vital-value">{medicalData.heartRate}</span>
                </div>
                <div className="vital-item">
                  <span className="vital-label">Blood Pressure</span>
                  <span className="vital-value">{medicalData.bloodPressure}</span>
                </div>
                <div className="vital-item">
                  <span className="vital-label">Temperature</span>
                  <span className="vital-value">{medicalData.temperature}</span>
                </div>
                <div className="vital-item">
                  <span className="vital-label">Oxygen Level</span>
                  <span className="vital-value">{medicalData.oxygenLevel}</span>
                </div>
                <div className="vital-item">
                  <span className="vital-label">Stress Level</span>
                  <span className="vital-value">{medicalData.stressLevel}</span>
                </div>
              </div>
            </div>

            {/* Emotional Analysis */}
            <div className="medical-card">
              <div className="card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.21 15.38A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <h3>Emotional Analysis</h3>
              </div>
              <div className="emotion-analysis">
                <div className="emotion-bar">
                  <span className="emotion-label">Joy</span>
                  <div className="progress-bar">
                    <div className="progress-fill joy" style={{ width: '85%' }}></div>
                  </div>
                  <span className="emotion-percent">85%</span>
                </div>
                <div className="emotion-bar">
                  <span className="emotion-label">Anger</span>
                  <div className="progress-bar">
                    <div className="progress-fill anger" style={{ width: '25%' }}></div>
                  </div>
                  <span className="emotion-percent">25%</span>
                </div>
                <div className="emotion-bar">
                  <span className="emotion-label">Sadness</span>
                  <div className="progress-bar">
                    <div className="progress-fill sadness" style={{ width: '15%' }}></div>
                  </div>
                  <span className="emotion-percent">15%</span>
                </div>
                <div className="emotion-bar">
                  <span className="emotion-label">Anxiety</span>
                  <div className="progress-bar">
                    <div className="progress-fill anxiety" style={{ width: '30%' }}></div>
                  </div>
                  <span className="emotion-percent">30%</span>
                </div>
              </div>
            </div>

            {/* Facial Features Analysis */}
            <div className="medical-card">
              <div className="card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3>Facial Features</h3>
              </div>
              <div className="facial-features">
                <div className="feature-card">
                  <div className="feature-title">Face Detection</div>
                  <span className="feature-status success">✓ Detected</span>
                </div>
                <div className="feature-card">
                  <div className="feature-title">Eye Movement</div>
                  <span className="feature-status success">✓ Normal</span>
                </div>
                <div className="feature-card">
                  <div className="feature-title">Facial Expressions</div>
                  <span className="feature-status success">✓ Analyzed</span>
                </div>
                <div className="feature-card">
                  <div className="feature-title">Voice Recognition</div>
                  <span className="feature-status success">✓ Completed</span>
                </div>
              </div>
            </div>

            {/* Voice Recognition */}
            <div className="medical-card">
              <div className="card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <h3>Voice Recognition</h3>
              </div>
              <div className="voice-recognition">
                <div className="voice-item">
                  <span className="voice-label">Voice Pattern</span>
                  <span className="voice-status success">✓ Analyzed</span>
                </div>
                <div className="voice-item">
                  <span className="voice-label">Tone Analysis</span>
                  <span className="voice-status success">✓ Completed</span>
                </div>
                <div className="voice-item">
                  <span className="voice-label">Speech Clarity</span>
                  <span className="voice-status success">✓ Normal</span>
                </div>
                <div className="voice-item">
                  <span className="voice-label">Emotion Detection</span>
                  <span className="voice-status success">✓ Detected</span>
                </div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="medical-card">
              <div className="card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <h3>Health Recommendations</h3>
              </div>
              <div className="recommendations">
                <div className="recommendation-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Maintain regular exercise routine</span>
                </div>
                <div className="recommendation-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Practice stress management techniques</span>
                </div>
                <div className="recommendation-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Ensure adequate sleep (7-8 hours)</span>
                </div>
                <div className="recommendation-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Stay hydrated throughout the day</span>
                </div>
                <div className="recommendation-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Follow up with healthcare provider</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Consultation Section */}
        <section className="doctor-consultation-section">
          <div className="consultation-content">
            <div className="consultation-text">
              <h2>Doctor's Analysis</h2>
              <p>Based on the facial recognition and medical data analysis, your overall health status is good. Continue following the recommended health practices.</p>
            </div>
            <div className="doctor-illustration">
              <img src={doct2Image} alt="Doctor Consultation" />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="report-actions">
          <button className="action-btn save-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Report
          </button>
          <button className="action-btn print-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Report
          </button>
          <button className="action-btn share-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewReport;
