import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "./UserProfile.css"; // Ensure this file includes the CSS

const UserProfile = () => {
  const { token } = useContext(AuthContext);
  const [stripeLink, setStripeLink] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    oldPassword: "", // Add old password field
    newPassword: "", // Add new password field
    confirmPassword: "", // Add confirm new password field
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserData({
          name: response.data.name,
          email: response.data.email,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();

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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.oldPassword) {
      setError("Old password is needed");
      return;
    }

    if (
      userData.newPassword &&
      userData.newPassword !== userData.confirmPassword
    ) {
      setError("New password and confirmation password do not match.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/profile",
        userData,
        {
          headers: { "x-auth-token": token },
        }
      );
      setSuccessMessage("Profile updated successfully!");
      setError("");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError(
        "Failed to update profile. Please check your inputs and try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="user-container">
      <h2 className="mb-4" style={{ marginLeft: "35%" }}>
        User Profile
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {stripeLink && (
        <a
          href={stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-info mt-4 stripe"
        >
          Connect your bank account
        </a>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group mb-3">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className="form-control"
            value={userData.oldPassword}
            onChange={handleChange}
            placeholder="Enter your old password"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="form-control"
            value={userData.newPassword}
            onChange={handleChange}
            placeholder="Leave blank to keep the current password"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your new password"
          />
        </div>
        <button type="submit" className="btn btn-primary update-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
