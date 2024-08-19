import React from "react";
import { Link } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <h1 className="order-success-title">Thank You for Your Purchase!</h1>
        <p className="order-success-message">
          Your payment was successful, and your ticket is confirmed.
        </p>
        <p className="order-success-info">
          You will receive a confirmation email shortly with your ticket
          details.
        </p>
        <Link to="/" className="order-success-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
