import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const AddTicket = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  const validateInputs = () => {
    let validationErrors = {};
    if (!eventName.trim()) {
      validationErrors.eventName = "Event Name is required.";
    }
    if (!description.trim()) {
      validationErrors.description = "Description is required.";
    }
    if (!venue.trim()) {
      validationErrors.venue = "Venue is required.";
    }
    if (!date.trim()) {
      validationErrors.date = "Date is required.";
    }
    if (!price) {
      validationErrors.price = "Price is required.";
    } else if (isNaN(price) || price <= 0) {
      validationErrors.price = "Price must be a positive number.";
    }
    if (!quantity) {
      validationErrors.quantity = "Quantity is required.";
    } else if (isNaN(quantity) || quantity <= 0) {
      validationErrors.quantity = "Quantity must be a positive number.";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTicket = { eventName, description, venue, date, price, quantity };

    // Debugging: Log the state before sending
    console.log("Submitting the following data:", newTicket);

    try {
      const response = await fetch("http://localhost:5000/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(newTicket),
      });

      const data = await response.json();

      if (response.ok) {
        setEventName("");
        setDescription("");
        setVenue("");
        setDate("");
        setPrice("");
        setQuantity("");
        setErrors({});
        alert("Ticket created successfully!");
      } else {
        console.error("Failed to create ticket:", data.message || data);
        alert("Failed to create ticket: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An error occurred while creating the ticket.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div
            className="card shadow-sm p-4"
            style={{ backgroundColor: "#D3D3D3" }}
          >
            <h2 className="h4 text-center mb-4">Create a New Ticket</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Event Name:</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.eventName ? "is-invalid" : ""
                  }`}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
                {errors.eventName && (
                  <div className="invalid-feedback">{errors.eventName}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Venue:</label>
                <input
                  type="text"
                  className={`form-control ${errors.venue ? "is-invalid" : ""}`}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
                {errors.venue && (
                  <div className="invalid-feedback">{errors.venue}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Date:</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Price:</label>
                <input
                  type="number"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity:</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.quantity ? "is-invalid" : ""
                  }`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                {errors.quantity && (
                  <div className="invalid-feedback">{errors.quantity}</div>
                )}
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
