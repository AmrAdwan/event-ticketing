import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import registerImage from "../assets/register-image.jpg";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Basic validation
    if (!name.trim()) {
      setError("Please fill in your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please fill in your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/login"); // Redirect to login page after registration
    } catch (error) {
      console.error("Registration failed:", error);
      if (
        error.response &&
        error.response.data.message.includes("Email already exists")
      ) {
        setError("Email is already registered.");
      } else {
        setError("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <img src={registerImage} alt="Register" className="img-fluid" />
            </div>
            {/* <h2 className="h4 text-center mb-4">Register</h2> */}
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-outline-success">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
