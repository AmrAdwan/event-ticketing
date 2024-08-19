import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const card = elements.getElement(CardElement);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const createPaymentIntent = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/payment/create-payment-intent",
      {
        amount: 20,
      }
    );

    setClientSecret(response.data.clientSecret);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={processing || !stripe || succeeded}>
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
