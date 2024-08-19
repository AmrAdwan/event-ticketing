// frontend/src/components/Contact.js
import React, { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Sanitize inputs
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);

    // Clear error
    setError("");

    // Send the message to your email
    try {
      await axios.post("http://localhost:5000/api/contact", {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
      });
      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send the message. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Contact Us</h2>
      <p>
        If you have any questions, feel free to reach out to us using the form
        below.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message:</label>
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-outline-info">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
