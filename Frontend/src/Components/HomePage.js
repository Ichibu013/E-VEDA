import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/HomePage.css';
import headerImg from '../Assets/header.png';
import aboutImg from '../Assets/about-img.png';
import doc1 from '../Assets/doc-1.png';
import doc2 from '../Assets/doc-2.png';
import doc3 from '../Assets/doc-3.png';
import doc4 from '../Assets/doc-4.png';

// Import the new Navbar component
import Navbar from '../Components/Navbar';

function HomePage() {
  const navigate = useNavigate();
  // State for the navbar is now managed here
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <>
      {/* Header */}
      <header className="header" id="home">
        {/* Render the Navbar component and pass state and function as props */}
        <Navbar isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
      </header>

      <main>
        <section className="health py" id="home-section">
          <div className="container grid">
            <div className="header-inner">
              <div className="header-inner-left">
                <h1 className="animate-fade-in-up">
                  Your most trusted
                  <span>health partner</span>
                </h1>
                <p className="lead animate-fade-in-up-delay-1">the best match services for you</p>
                <p className="text text-md animate-fade-in-up-delay-2">
                  E-VEDA is your comprehensive integrated healthcare platform, designed to revolutionize the way you access medical services. We combine cutting-edge technology with compassionate care to provide personalized health solutions tailored to your unique needs.
                </p>
                <p className="text text-md animate-fade-in-up-delay-3">
                  Our platform connects you with experienced healthcare professionals, offers advanced diagnostic tools, and provides seamless access to medical consultations, health monitoring, and treatment plans—all in one convenient, secure, and user-friendly environment.
                </p>
                <p className="text text-md animate-fade-in-up-delay-4">
                  Experience the future of healthcare where innovation meets empathy, and your well-being is our top priority. Join thousands of satisfied patients who trust E-VEDA for their healthcare journey.
                </p>
                <div className="btn-group animate-fade-in-up-delay-5">
                  <a href="#about" className="btn btn-white">
                    Learn More
                  </a>
                  <a href="#contact" className="btn btn-light-blue" onClick={handleSignUpClick}>
                    Sign Up
                  </a>
                </div>
              </div>
              <div className="header-inner-right">
                <img src={headerImg} alt="header visual" />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="about py">
          <div className="container grid">
            <div className="about-left">
              <div className="section-head about-animate-1">
                <h2>About Us</h2>
              </div>
              <p className="text text-lg about-animate-2">
                At E-VEDA, we are dedicated to providing compassionate, expert
                healthcare tailored to your individual needs. With a focus on
                innovation, trust, and patient-centered care, we strive to
                bridge the gap between traditional values and modern medical
                solutions. Our experienced team is committed to supporting your
                well-being through every stage of your healthcare journey.
              </p>
              <p className="text text-lg about-animate-3">
                E-VEDA stands at the forefront of digital healthcare innovation, combining advanced medical technology with personalized patient care. Our integrated platform offers comprehensive health management solutions, including real-time health monitoring, AI-powered diagnostics, telemedicine consultations, and seamless coordination between patients and healthcare providers.
              </p>
              <p className="text text-lg about-animate-4">
                We believe in making quality healthcare accessible, affordable, and convenient for everyone. Through our state-of-the-art platform, patients can schedule appointments, access their medical records, receive personalized health recommendations, and connect with certified medical professionals—all from the comfort of their homes. Our commitment to excellence and continuous improvement ensures that we remain your trusted partner in health and wellness.
              </p>
              <div className="about-animate-5">
                <a href="#doc-panel" className="btn btn-blue">
                  Learn More
                </a>
              </div>
            </div>
            <div className="about-right about-image-container">
              <div className="img about-image-wrapper">
                <img src={aboutImg} alt="about" className="about-image" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {/* <section id="services" className="services py">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="lead">The Best Doctor gives the least medicines</h2>
            <p className="text text-lg">
              We offer a comprehensive range of medical services designed to
              meet your everyday health needs. From advanced diagnostics and
              cardio monitoring to emergency care and personalized treatment
              plans, our facility is equipped to handle both routine and
              critical cases. Our mission is to deliver high-quality, accessible
              healthcare that puts you first—always.
            </p>
            <div className="line-art flex">
              <div></div>
              <img src={dots} alt="decor" />
              <div></div>
            </div>
          </div> */}

        {/* <div className="services-inner text-center grid"> */}
        {/* Repeat for all services with icons */}
        {/* <article className="service-item">
              <div className="icon"> */}
        {/* Image paths need to be fixed here as well */}
        {/* <img src={icon1} alt="icon1" />
              </div>
              <h3>Cardio Monitoring</h3>
              <p className="text text-sm">
                pain itself is something to be experienced; it is pursued by
                those who desire it, because it brings some benefit."
              </p>
            </article> */}

        {/* <article className="service-item">
              <div className="icon"> */}
        {/* Image paths need to be fixed here as well */}
        {/* <img src={icon2} alt="icon2" />
              </div>
              <h3>Cardio Monitoring</h3>
              <p className="text text-sm">
                pain itself is something to be experienced; it is pursued by
                those who desire it, because it brings some benefit."
              </p>
            </article> */}
        {/* Add other services here */}
        {/* </div>
        </div>
      </section> */}

        {/* Features */}
        <section id="features" className="features py">
          <div className="container">
            <div className="section-head text-center">
              <h2>Our Key Features</h2>
              <p className="text text-lg">
                Discover the powerful capabilities that make E-VEDA your trusted healthcare companion
              </p>
            </div>
            <div className="features-inner grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>AI-Powered Diagnosis</h3>
                <p className="text">
                  Advanced artificial intelligence analyzes video and audio patterns to provide accurate emotional and health assessments.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Expert Medical Consultation</h3>
                <p className="text">
                  Connect with certified healthcare professionals for personalized consultations and treatment plans.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3>Video & Audio Analysis</h3>
                <p className="text">
                  Comprehensive analysis of facial expressions, voice patterns, and speech characteristics for holistic health monitoring.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3>24/7 Health Monitoring</h3>
                <p className="text">
                  Continuous health tracking and real-time alerts to help you stay on top of your wellness journey.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3>Secure & Private</h3>
                <p className="text">
                  Your health data is protected with enterprise-grade encryption and privacy controls.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3>Accessible Anywhere</h3>
                <p className="text">
                  Access your health records, consultations, and diagnostic results from anywhere, anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section id="doc-panel" className="doc-panel py">
          <div className="container">
            <div className="section-head">
              <h2>Our Doctor Panel</h2>
              <p className="text text-lg text-center">
                Meet our team of experienced healthcare professionals dedicated to your well-being
              </p>
            </div>
            <div className="doc-panel-inner">
              <div className="doc-panel-item">
                <div className="img">
                  <img src={doc1} alt="Dr. Rajesh Kumar" />
                  <div className="info">
                    <p className="lead">Dr. Rajesh Kumar</p>
                    <p className="text-lg">Cardiologist</p>
                  </div>
                </div>
              </div>

              <div className="doc-panel-item">
                <div className="img">
                  <img src={doc2} alt="Dr. Priya Patel" />
                  <div className="info">
                    <p className="lead">Dr. Priya Patel</p>
                    <p className="text-lg">Psychiatrist</p>
                  </div>
                </div>
              </div>

              <div className="doc-panel-item">
                <div className="img">
                  <img src={doc3} alt="Dr. Anjali Desai" />
                  <div className="info">
                    <p className="lead">Dr. Anjali Desai</p>
                    <p className="text-lg">General Medicine</p>
                  </div>
                </div>
              </div>

              <div className="doc-panel-item">
                <div className="img">
                  <img src={doc4} alt="Dr. Vikram Singh" />
                  <div className="info">
                    <p className="lead">Dr. Vikram Singh</p>
                    <p className="text-lg">Neurologist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact py">
          <div className="container grid">
            <div className="contact-left">
              <iframe
                title="E-VEDA Location Map - Pune, Maharashtra"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.1419961545!2d73.722881234375!3d18.524564599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1691670428839!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="contact-right text-white text-center bg-blue">
              <div className="contact-head">
                <h3 className="lead">Contact Us</h3>
                <p className="text text-md">
                  Pain itself is something important, but often obligations
                  arise that require choices and responsibilities to be
                  fulfilled!
                </p>
              </div>
              <form>
                <div className="form-element">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your name"
                  />
                </div>
                <div className="form-element">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
                  />
                </div>
                <div className="form-element">
                  <textarea
                    rows="5"
                    placeholder="Your Message"
                    className="form-control"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-white btn-submit">
                  <i className="fas fa-arrow-right"></i> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner grid">
            <div className="footer-col">
              <div className="footer-brand">
                <h3>E-VEDA</h3>
                <p className="text">
                  Emotion Video & Audio Diagnosis Assistant - Your trusted healthcare companion for comprehensive health monitoring and expert medical consultations.
                </p>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#doc-panel">Our Doctors</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
              <h4 style={{ marginTop: '2rem' }}>Resources</h4>
              <ul className="footer-links">
                <li><a href="#!">Help Center</a></li>
                <li><a href="#!">FAQs</a></li>
                <li><a href="#!">Blog</a></li>
                <li><a href="#!">Patient Guide</a></li>
                <li><a href="#!">Health Tips</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li><a href="#features">AI-Powered Diagnosis</a></li>
                <li><a href="#features">Video Analysis</a></li>
                <li><a href="#features">Audio Analysis</a></li>
                <li><a href="#doc-panel">Online Consultation</a></li>
                <li><a href="#features">Health Monitoring</a></li>
                <li><a href="#features">Telemedicine</a></li>
              </ul>
              <h4 style={{ marginTop: '2rem' }}>Legal</h4>
              <ul className="footer-links">
                <li><a href="#!">Privacy Policy</a></li>
                <li><a href="#!">Terms of Service</a></li>
                <li><a href="#!">Cookie Policy</a></li>
                <li><a href="#!">Disclaimer</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul className="footer-contact">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Pune, Maharashtra, India</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+91 98765 43210</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>info@eveda.com</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                </li>
              </ul>
              <div className="footer-newsletter">
                <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Newsletter</h4>
                <p className="text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Subscribe to get health tips and updates
                </p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Enter your email" className="newsletter-input" />
                  <button type="button" className="newsletter-button">Subscribe</button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; {new Date().getFullYear()} E-VEDA. All rights reserved.</p>
              <p className="text-sm">Designed with ❤️ for better healthcare</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
