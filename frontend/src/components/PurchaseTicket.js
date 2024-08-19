import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./PurchaseTicket.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ ticket }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!ticket) return;

    axios
      .post("http://localhost:5000/api/payment/create-payment-intent", {
        ticketId: ticket._id,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => console.error("Failed to create payment intent", err));
  }, [ticket]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/order-success",
      },
    });

    if (error) {
      console.error("Payment failed:", error.message);
    } else {
      console.log("Payment successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {clientSecret && (
        <>
          <PaymentElement className="custom-payment-element" />
          <hr className="divider" />
          <button
            type="submit"
            disabled={!stripe || !clientSecret}
            className="pay-button"
          >
            Pay €{ticket.price}
          </button>
        </>
      )}
    </form>
  );
};

const PurchaseTicket = () => {
  const { urlSlug } = useParams();
  const [ticket, setTicket] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tickets/${urlSlug}`)
      .then((res) => {
        if (res.data) {
          setTicket(res.data);
          return axios.post(
            "http://localhost:5000/api/payment/create-payment-intent",
            {
              ticketId: res.data._id,
            }
          );
        } else {
          throw new Error("Ticket not found");
        }
      })
      .then((res) => {
        if (res.data && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          throw new Error("Failed to create payment intent");
        }
      })
      .catch((err) =>
        console.error("Failed to fetch ticket or create payment intent", err)
      );
  }, [urlSlug]);

  return (
    <div className="purchase-ticket-container">
      {ticket ? (
        <div className="ticket-details-and-payment">
          <div className="ticket-info">
            <h1>{ticket.eventName}</h1>
            <p>Description: {ticket.description}</p>
            <p>Venue: {ticket.venue}</p>
            <p>Date: {new Date(ticket.date).toLocaleDateString()}</p>
            <p>
              Time Slot: {ticket.beginTime} - {ticket.endTime}
            </p>
            <p>Price: €{ticket.price}</p>
          </div>
          <div className="payment-info">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm ticket={ticket} />
              </Elements>
            )}
          </div>
        </div>
      ) : (
        <p>Loading ticket...</p>
      )}
    </div>
  );
};

export default PurchaseTicket;
