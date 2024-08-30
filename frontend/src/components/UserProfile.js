// frontend/src/components/UserProfile.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const UserProfile = () => {
  const { token } = useContext(AuthContext);
  const [stripeLink, setStripeLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the Stripe onboarding link
    const fetchStripeLink = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/stripe-onboarding-link",
          {
            headers: { "x-auth-token": token },
          }
        );
        setStripeLink(response.data.url);
      } catch (error) {
        console.error("Error fetching Stripe onboarding link:", error);
        setError(
          "Failed to load Stripe onboarding link. Please try again later."
        );
      }
    };

    fetchStripeLink();
  }, [token]);

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      {stripeLink ? (
        <a href={stripeLink} target="_blank" rel="noopener noreferrer">
          Connect your bank account
        </a>
      ) : (
        <p>{error || "Loading..."}</p>
      )}
    </div>
  );
};

export default UserProfile;
