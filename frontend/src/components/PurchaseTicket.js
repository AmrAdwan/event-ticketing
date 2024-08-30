// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { useNavigate } from "react-router-dom";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import axios from "axios";
// import "./PurchaseTicket.css";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// const CheckoutForm = ({ ticket, quantity, setQuantity, totalPrice }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [clientSecret, setClientSecret] = useState("");
//   const navigate = useNavigate(); // Initialize navigate

//   useEffect(() => {
//     if (!ticket) return;

//     axios
//       .post("http://localhost:5000/api/payment/create-payment-intent", {
//         ticketId: ticket._id,
//         quantity, // Send the quantity to backend
//       })
//       .then((res) => {
//         setClientSecret(res.data.clientSecret);
//       })
//       .catch((err) => console.error("Failed to create payment intent", err));
//   }, [ticket, quantity]); // Recreate payment intent when quantity changes

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: "http://localhost:3000/order-success",
//       },
//     });

//     if (error) {
//       console.error("Payment failed:", error.message);
//     } else {
//       navigate("/order-success"); // Navigate to the success page
//       console.log("Payment successful!");
//     }
//   };

//   const handleQuantityChange = (change) => {
//     setQuantity((prevQuantity) => Math.max(1, prevQuantity + change)); // Ensure quantity is at least 1
//   };

//   return (
//     <form onSubmit={handleSubmit} className="checkout-form">
//       {clientSecret && (
//         <>
//           <div className="ticket-quantity">
//             <label>Quantity:</label>
//             <div className="quantity-controls">
//               <button
//                 type="button"
//                 onClick={() => handleQuantityChange(-1)}
//                 disabled={quantity <= 1}
//               >
//                 -
//               </button>
//               <span>{quantity}</span>
//               <button type="button" onClick={() => handleQuantityChange(1)}>
//                 +
//               </button>
//             </div>
//           </div>
//           <div className="price-info">
//             <span>Total Price:</span>
//             <span>€{totalPrice.toFixed(2)}</span>
//           </div>
//           <PaymentElement className="custom-payment-element" />
//           <hr className="divider" />
//           <button
//             type="submit"
//             disabled={!stripe || !clientSecret}
//             className="pay-button"
//           >
//             Pay €{totalPrice.toFixed(2)}
//           </button>
//         </>
//       )}
//     </form>
//   );
// };

// const PurchaseTicket = () => {
//   const { urlSlug } = useParams();
//   const [ticket, setTicket] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/tickets/${urlSlug}`)
//       .then((res) => {
//         if (res.data) {
//           setTicket(res.data);
//           setTotalPrice(res.data.price);
//           return axios.post(
//             "http://localhost:5000/api/payment/create-payment-intent",
//             {
//               ticketId: res.data._id,
//               quantity: 1, // Default quantity
//             }
//           );
//         } else {
//           throw new Error("Ticket not found");
//         }
//       })
//       .then((res) => {
//         if (res.data && res.data.clientSecret) {
//           setClientSecret(res.data.clientSecret);
//         } else {
//           throw new Error("Failed to create payment intent");
//         }
//       })
//       .catch((err) =>
//         console.error("Failed to fetch ticket or create payment intent", err)
//       );
//   }, [urlSlug]);

//   useEffect(() => {
//     if (ticket) {
//       setTotalPrice(ticket.price * quantity);
//     }
//   }, [quantity, ticket]);

//   return (
//     <div className="purchase-ticket-container">
//       {ticket ? (
//         <div className="ticket-details-and-payment">
//           <div className="ticket-info">
//             <h1>{ticket.eventName}</h1>
//             <p>
//               <strong>Description:</strong> {ticket.description}
//             </p>
//             <p>
//               <strong>Venue:</strong> {ticket.venue}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(ticket.date).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Time Slot:</strong> {ticket.beginTime} - {ticket.endTime}
//             </p>
//             <p>
//               <strong>Price per Ticket:</strong> €{ticket.price}
//             </p>
//           </div>
//           <div className="payment-info">
//             {clientSecret && (
//               <Elements stripe={stripePromise} options={{ clientSecret }}>
//                 <CheckoutForm
//                   ticket={ticket}
//                   quantity={quantity}
//                   setQuantity={setQuantity}
//                   totalPrice={totalPrice}
//                 />
//               </Elements>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>Loading ticket...</p>
//       )}
//     </div>
//   );
// };

// export default PurchaseTicket;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const CheckoutForm = ({ ticket, quantity, setQuantity, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  // Calculate the service fee (10%)
  const serviceFee = totalPrice * 0.1;
  // Calculate total price including the service fee
  const totalPriceWithFee = totalPrice + serviceFee;

  useEffect(() => {
    if (!ticket) return;

    axios
      .post("http://localhost:5000/api/payment/create-payment-intent", {
        ticketId: ticket._id,
        quantity,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Failed to create payment intent", err.response || err);
      });
  }, [ticket, quantity]);

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
      navigate("/order-success");
      console.log("Payment successful!");
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {clientSecret && (
        <>
          <div className="ticket-quantity">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQuantityChange(1)}>
                +
              </button>
            </div>
          </div>
          <div className="price-info">
            <p>
              <strong>Total Price (excl. service fee):</strong> €
              {totalPrice.toFixed(2)}
            </p>
            <p>
              <strong>Service Fee (10%):</strong> €{serviceFee.toFixed(2)}
            </p>
            <p>
              <strong>Total Price (incl. service fee):</strong> €
              {totalPriceWithFee.toFixed(2)}
            </p>
          </div>
          <PaymentElement className="custom-payment-element" />
          <hr className="divider" />
          <button
            type="submit"
            disabled={!stripe || !clientSecret}
            className="pay-button"
          >
            Pay €{totalPriceWithFee.toFixed(2)}
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
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log("Fetching ticket with URL Slug:", urlSlug);

    axios
      .get(`http://localhost:5000/api/tickets/${urlSlug}`)
      .then((res) => {
        if (res.data) {
          console.log("Ticket fetched successfully:", res.data);
          setTicket(res.data);
          setTotalPrice(res.data.price);
          return axios.post(
            "http://localhost:5000/api/payment/create-payment-intent",
            {
              ticketId: res.data._id,
              quantity: 1,
            }
          );
        } else {
          console.error("No ticket data received:", res);
          throw new Error("Ticket not found");
        }
      })
      .then((res) => {
        if (res.data && res.data.clientSecret) {
          console.log(
            "Payment intent created successfully:",
            res.data.clientSecret
          );
          setClientSecret(res.data.clientSecret);
        } else {
          console.error("No client secret received:", res);
          throw new Error("Failed to create payment intent");
        }
      })
      .catch((err) => {
        console.error("Failed to create payment intent", err.response || err);
      });
  }, [urlSlug]);

  useEffect(() => {
    if (ticket) {
      setTotalPrice(ticket.price * quantity);
    }
  }, [quantity, ticket]);

  return (
    <div className="purchase-ticket-container">
      {ticket ? (
        <div className="ticket-details-and-payment">
          <div className="ticket-info">
            <h1>{ticket.eventName}</h1>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            <p>
              <strong>Venue:</strong> {ticket.venue}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(ticket.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time Slot:</strong> {ticket.beginTime} - {ticket.endTime}
            </p>
            <p>
              <strong>Price per Ticket:</strong> €{ticket.price}
            </p>
          </div>
          <div className="payment-info">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  ticket={ticket}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  totalPrice={totalPrice}
                />
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
