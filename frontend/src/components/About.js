import React from "react";
import "./About.css"; // Import the corresponding CSS file for styling

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>About Us</h1>
            <p>Your trusted partner for event ticketing.</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container content-section">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2>Who We Are</h2>
            <p>
              Welcome to Event Ticketing, your number one source for buying and
              selling event tickets. We're dedicated to providing you the very
              best experience with a focus on customer satisfaction, security,
              and convenience.
            </p>

            <h2>Our Journey</h2>
            <p>
              Founded in 2024, Event Ticketing has come a long way from its
              beginnings as a small project. Our passion for delivering easy
              access to event tickets drove us to create this platform, and gave
              us the impetus to turn hard work and inspiration into a booming
              online platform.
            </p>

            <h2>Our Mission</h2>
            <p>
              We aim to make event ticketing accessible and convenient for
              everyone. Whether you're looking for tickets to a concert, a
              sports event, or a theater show, Event Ticketing is here to make
              it happen.
            </p>

            <h2>Contact Us</h2>
            <p>
              We hope you enjoy our platform as much as we enjoy offering it to
              you. If you have any questions or comments, please don't hesitate
              to contact us.
            </p>

            <p>
              Sincerely,
              <br />
              <strong>The Event Ticketing Team</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
