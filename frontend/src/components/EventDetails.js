// frontend/src/components/EventDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const EventDetails = () => {
  const { urlSlug } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tickets/${urlSlug}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails();
  }, [urlSlug]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{event.eventName}</h2>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Venue:</strong> {event.venue}
      </p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Price:</strong> €{event.price}
      </p>
      <p>
        <strong>Available Tickets:</strong> {event.quantity}
      </p>
      <div className="mt-5">
        {/* Optional: Embed Google Maps or similar service */}
        {/* <iframe
          src={`https://maps.google.com/maps?q=${event.venue}&output=embed`}
          width="100%"
          height="400"
          frameBorder="0"
        ></iframe> */}
      </div>
    </div>
  );
};

export default EventDetails;
