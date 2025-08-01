import React, { useState } from 'react';
import './HomePage.css';
import headerImg from './Assets/header.png';
import aboutImg from './Assets/about-img.png';
import doc1 from './Assets/doc-1.png';
import doc2 from './Assets/doc-2.png';
import doc3 from './Assets/doc-3.png';

// Import the new Navbar component
import Navbar from './Navbar';

function HomePage() {
  // State for the navbar is now managed here
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div>
      {/* Header */}
      <header className="header bg-blue" id="home">
        {/* Render the Navbar component and pass state and function as props */}
        <Navbar isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
      </header>

      <div className="header-inner text-white text-center">
        <div className="container grid">
          <div className="header-inner-left">
            <h1>
              Your most trusted
              <br /> <span>health partner</span>
            </h1>
            <p className="lead">the best match services for you</p>
            <p className="text text-md">
              Pain itself is something that is very important, and it is pursued
              by those who desire it because of the consequences.
            </p>
            <div className="btn-group">
              <a href="#about" className="btn btn-white">
                Learn More
              </a>
              <a href="#contact" className="btn btn-light-blue">
                Sign In
              </a>
            </div>
          </div>
          <div className="header-inner-right">
            <img src={headerImg} alt="header visual" />
          </div>
        </div>
      </div>

      {/* About */}
      <section id="about" className="about py">
        <div className="container grid">
          <div className="about-left text-center">
            <div className="section-head">
              <h2>About Us</h2>
              <div className="border-line"></div>
            </div>
            <p className="text text-lg">
              At E-VEDA, we are dedicated to providing compassionate, expert
              healthcare tailored to your individual needs. With a focus on
              innovation, trust, and patient-centered care, we strive to bridge
              the gap between traditional values and modern medical solutions.
              Our experienced team is committed to supporting your well-being
              through every stage of your healthcare journey.
            </p>
            <a href="#services" className="btn btn-white">
              Learn More
            </a>
          </div>
          <div className="about-right flex">
            <div className="img">
              <img src={aboutImg} alt="about" />
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

      {/* Doctors */}
      <section id="doc-panel" className="doc-panel py">
        <div className="container">
          <div className="section-head">
            <h2>Our Doctor Panel</h2>
          </div>
          <div className="doc-panel-inner grid">
            <div className="doc-panel-item">
              <div className="img flex">
                <img src={doc1} alt="doc1" />
                <div className="info text-center bg-blue text-white flex">
                  <p className="lead">Samuel Goe</p>
                  <p className="text-lg">Medicine</p>
                </div>
              </div>
            </div>

            <div className="doc-panel-item">
              <div className="img flex">
                <img src={doc2} alt="doc1" />
                <div className="info text-center bg-blue text-white flex">
                  <p className="lead">Srushti Shinde</p>
                  <p className="text-lg">Medicine</p>
                </div>
              </div>
            </div>

            <div className="doc-panel-item">
              <div className="img flex">
                <img src={doc3} alt="doc1" />
                <div className="info text-center bg-blue text-white flex">
                  <p className="lead">Shreeya Shinde</p>
                  <p className="text-lg">Medicine</p>
                </div>
              </div>
            </div>
            {/* Add doc2 and doc3 here similarly */}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact py">
        <div className="container grid">
          <div className="contact-left">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!..."
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="contact-right text-white text-center bg-blue">
            <div className="contact-head">
              <h3 className="lead">Contact Us</h3>
              <p className="text text-md">Lorem ipsum dolor sit amet...</p>
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
    </div>
  );
}

export default HomePage;
