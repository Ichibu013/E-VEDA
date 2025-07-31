import React from 'react';
import './App.css'; // This will be your main CSS file
import Header from './Components/Header';
import { useNavigate } from 'react-router-dom';
// Import other components as you create them (e.g., About, Services, etc.)

function App() {
  return (
    <div className="App">
      <Header />
      {/* Render other sections/components here */}
      <main>
        {/* About Section */}
        <section id="about" className="about py">
          <div className="about-inner">
            <div className="container grid">
              <div className="about-left text-center">
                <div className="section-head">
                  <h2>About Us</h2>
                  <div className="border-line"></div>
                </div>
                <p className="text text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Recusandae molestias delectus facilis, temporibus eum
                  consectetur, a debitis exercitationem quae distinctio aliquid
                  ea ipsam vitae esse amet soluta maxime dolorem? Inventore ut
                  maiores illo ipsum nisi, nulla eligendi unde reiciendis quod
                  voluptas velit sit voluptate perferendis cum pariatur
                  molestiae tenetur repellat!
                </p>
                <a href="#" className="btn btn-white">
                  Learn More
                </a>
              </div>
              <div className="about-right flex">
                <div className="img">
                  <img src="images/about-img.png" alt="About" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner One */}
        <section id="banner-one" className="banner-one text-center">
          <div className="container text-white">
            <blockquote className="lead">
              <i className="fas fa-quote-left"></i> When you are young and
              healthy, it never occurs to you that in a single second your whole
              life could change. <i className="fas fa-quote-right"></i>
            </blockquote>
            <small className="text text-sm">- Anonim Nano</small>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services py">
          <div className="container">
            <div className="section-head text-center">
              <h2 className="lead">
                The Best Doctor gives the least medicines
              </h2>
              <p className="text text-lg">
                A perfect way to show your hospital services
              </p>
              <div className="line-art flex">
                <div></div>
                <img src="images/4-dots.png" alt="dots" />
                <div></div>
              </div>
            </div>
            <div className="services-inner text-center grid">
              <article className="service-item">
                <div className="icon">
                  <img src="images/service-icon-1.png" alt="icon" />
                </div>
                <h3>Cardio Monitoring</h3>
                <p className="text text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis possimus doloribus facilis velit, assumenda
                  tempora quas mollitia quos voluptatibus consequatur!
                </p>
              </article>
              <article className="service-item">
                <div className="icon">
                  <img src="images/service-icon-2.png" alt="icon" />
                </div>
                <h3>Medical Treatment</h3>
                <p className="text text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis possimus doloribus facilis velit, assumenda
                  tempora quas mollitia quos voluptatibus consequatur!
                </p>
              </article>
              <article className="service-item">
                <div className="icon">
                  <img src="images/service-icon-3.png" alt="icon" />
                </div>
                <h3>Emergency Help</h3>
                <p className="text text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis possimus doloribus facilis velit, assumenda
                  tempora quas mollitia quos voluptatibus consequatur!
                </p>
              </article>
              <article className="service-item">
                <div className="icon">
                  <img src="images/service-icon-4.png" alt="icon" />
                </div>
                <h3>First Aid</h3>
                <p className="text text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis possimus doloribus facilis velit, assumenda
                  tempora quas mollitia quos voluptatibus consequatur!
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Banner Two */}
        <section id="banner-two" className="banner-two text-center">
          <div className="container grid">
            <div className="banner-two-left">
              <img src="images/banner-2-img.png" alt="Banner" />
            </div>
            <div className="banner-two-right">
              <p className="lead text-white">
                When you are young and healthy, it never occurs to you that in a
                single second your whole life could change.
              </p>
              <div className="btn-group">
                <a href="#" className="btn btn-white">
                  Learn More
                </a>
                <a href="#" className="btn btn-light-blue">
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doc-panel" className="doc-panel py">
          <div className="container">
            <div className="section-head">
              <h2>Our Doctor Panel</h2>
            </div>
            <div className="doc-panel-inner grid">
              <div className="doc-panel-item">
                <div className="img flex">
                  <img src="images/doc-1.png" alt="doctor image" />
                  <div className="info text-center bg-blue text-white flex">
                    <p className="lead">samuel goe</p>
                    <p className="text-lg">Medicine</p>
                  </div>
                </div>
              </div>
              <div className="doc-panel-item">
                <div className="img flex">
                  <img src="images/doc-2.png" alt="doctor image" />
                  <div className="info text-center bg-blue text-white flex">
                    <p className="lead">elizabeth ira</p>
                    <p className="text-lg">Cardiology</p>
                  </div>
                </div>
              </div>
              <div className="doc-panel-item">
                <div className="img flex">
                  <img src="images/doc-3.png" alt="doctor image" />
                  <div className="info text-center bg-blue text-white flex">
                    <p className="lead">tanya collins</p>
                    <p className="text-lg">Medicine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Package Services Section */}
        <section
          id="package-service"
          className="package-service py text-center"
        >
          <div className="container">
            <div className="package-service-head text-white">
              <h2>Package Service</h2>
              <p className="text text-lg">Best service package for you</p>
            </div>
            <div className="package-service-inner grid">
              <div className="package-service-item bg-white">
                <div className="icon flex">
                  <i className="fas fa-phone fa-2x"></i>
                </div>
                <h3>Regular Case</h3>
                <p className="text text-sm">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur, asperiores. Expedita, reiciendis quos beatae at
                  consequatur voluptatibus fuga iste adipisci.
                </p>
                <a href="#" className="btn btn-blue">
                  Read More
                </a>
              </div>
              <div className="package-service-item bg-white">
                <div className="icon flex">
                  <i className="fas fa-calendar-alt fa-2x"></i>
                </div>
                <h3>Serious Case</h3>
                <p className="text text-sm">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur, asperiores. Expedita, reiciendis quos beatae at
                  consequatur voluptatibus fuga iste adipisci.
                </p>
                <a href="#" className="btn btn-blue">
                  Read More
                </a>
              </div>
              <div className="package-service-item bg-white">
                <div className="icon flex">
                  <i className="fas fa-comments fa-2x"></i>
                </div>
                <h3>Emergency Case</h3>
                <p className="text text-sm">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur, asperiores. Expedita, reiciendis quos beatae at
                  consequatur voluptatibus fuga iste adipisci.
                </p>
                <a href="#" className="btn btn-blue">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section id="posts" className="posts py">
          <div className="container">
            <div className="section-head">
              <h2>Latest Post</h2>
            </div>
            <div className="posts-inner grid">
              <article className="post-item bg-white">
                <div className="img">
                  <img src="images/post-1.jpg" alt="Post" />
                </div>
                <div className="content">
                  <h4>
                    Inspiring stories of person and family centered care during
                    a global pandemic.
                  </h4>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Dolor voluptas eius recusandae sunt obcaecati esse facere
                    cumque. Aliquid, cupiditate debitis.
                  </p>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nobis quia ipsam, quis iure sed nulla.
                  </p>
                  <div className="info flex">
                    <small className="text text-sm">
                      <i className="fas fa-clock"></i> October 27, 2021
                    </small>
                    <small className="text text-sm">
                      <i className="fas fa-comment"></i> 5 comments
                    </small>
                  </div>
                </div>
              </article>
              <article className="post-item bg-white">
                <div className="img">
                  <img src="images/post-2.jpg" alt="Post" />
                </div>
                <div className="content">
                  <h4>
                    Inspiring stories of person and family centered care during
                    a global pandemic.
                  </h4>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Dolor voluptas eius recusandae sunt obcaecati esse facere
                    cumque. Aliquid, cupiditate debitis.
                  </p>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nobis quia ipsam, quis iure sed nulla.
                  </p>
                  <div className="info flex">
                    <small className="text text-sm">
                      <i className="fas fa-clock"></i> October 27, 2021
                    </small>
                    <small className="text text-sm">
                      <i className="fas fa-comment"></i> 5 comments
                    </small>
                  </div>
                </div>
              </article>
              <article className="post-item bg-white">
                <div className="img">
                  <img src="images/post-3.jpg" alt="Post" />
                </div>
                <div className="content">
                  <h4>
                    Inspiring stories of person and family centered care during
                    a global pandemic.
                  </h4>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Dolor voluptas eius recusandae sunt obcaecati esse facere
                    cumque. Aliquid, cupiditate debitis.
                  </p>
                  <p className="text text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nobis quia ipsam, quis iure sed nulla.
                  </p>
                  <div className="info flex">
                    <small className="text text-sm">
                      <i className="fas fa-clock"></i> October 27, 2021
                    </small>
                    <small className="text text-sm">
                      <i className="fas fa-comment"></i> 5 comments
                    </small>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact py">
          <div className="container grid">
            <div className="contact-left">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.6268289831164!2d-6.214682984112116!3d53.29621947996855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486709e0c9c80f8f%3A0x92f408d10f2277c2!2sREVO!5e0!3m2!1sen!2snp!4v1636264848776!5m2!1sen!2snp"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
            <div className="contact-right text-white text-center bg-blue">
              <div className="contact-head">
                <h3 className="lead">Contact Us</h3>
                <p className="text text-md">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga.
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
      <footer id="footer" className="footer text-center">
        <div className="container">
          <div className="footer-inner text-white py grid">
            <div className="footer-item">
              <h3 className="footer-head">about us</h3>
              <div className="icon">
                <img src="images/logo.png" alt="logo" />
              </div>
              <p className="text text-md">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Debitis saepe incidunt fugiat optio corporis ea!
              </p>
              <address>
                Medic Clinic <br />
                69 Deerpark Rd, Mount Merrion <br />
                Co. Dublin, A94 E9D3 <br />
                Ireland
              </address>
            </div>
            <div className="footer-item">
              <h3 className="footer-head">tags</h3>
              <ul className="tags-list flex">
                <li>medical care</li>
                <li>emergency</li>
                <li>therapy</li>
                <li>surgery</li>
                <li>medication</li>
                <li>nurse</li>
              </ul>
            </div>
            <div className="footer-item">
              <h3 className="footer-head">Quick Links</h3>
              <ul>
                <li>
                  <a href="#" className="text-white">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Our Plan
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Appointment Schedule
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-item">
              <h3 className="footer-head">make an appointment</h3>
              <p className="text text-md">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatum, omnis.
              </p>
              <ul className="appointment-info">
                <li>8:00 AM - 11:00 AM</li>
                <li>2:00 PM - 05:00 PM</li>
                <li>8:00 PM - 11:00 PM</li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>revomedic@gmail.com</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>+003 478 2834(00)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-links">
            <ul className="flex">
              <li>
                <a href="#" className="text-white flex">
                  {' '}
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white flex">
                  {' '}
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white flex">
                  {' '}
                  <i className="fab fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
