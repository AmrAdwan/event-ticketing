// frontend/src/components/Home.js
import React from "react";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to Event Ticketing</h1>
        <p className="lead">
          Manage your event tickets easily with our user-friendly platform.
        </p>
        <hr className="my-4" />
        <p>
          Whether you're hosting a small gathering or a large conference, our
          platform allows you to create, manage, share, and securely sell
          tickets with ease.
        </p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3>Getting Started</h3>
          <p>
            To begin using the application, you'll need to register for an
            account. Once registered, you can log in to access your dashboard,
            where you can create and manage tickets for your events.
          </p>
          <ul>
            <li>Register an account or log in if you already have one.</li>
            <li>Go to the "Add Ticket" page to create new tickets.</li>
            <li>
              View, share, edit, or delete your tickets from the "Your Tickets"
              page.
            </li>
            <li>Safely purchase tickets for your favorite events.</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Features</h3>
          <p>
            Our platform offers a range of features designed to make ticket
            management easy:
          </p>
          <ul>
            <li>Quick and easy ticket creation.</li>
            <li>Shareable ticket links for easy distribution.</li>
            <li>Secure login and user authentication.</li>
            <li>Simple ticket management with options to edit or delete.</li>
            <li>
              Safe and secure ticket purchasing with multiple payment methods.
            </li>
          </ul>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <h3>Safe and Secure Ticket Purchasing</h3>
          <p>
            Our platform ensures that all ticket purchases are handled securely
            through trusted payment gateways. Whether you're paying with a
            credit card, debit card, or other supported payment methods, you can
            rest assured that your transaction is safe.
          </p>
          <p>
            We use encryption and other security measures to protect your
            payment information, ensuring that your data remains confidential
            and secure at all times.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
