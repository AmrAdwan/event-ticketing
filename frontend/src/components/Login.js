import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import loginImage from "../assets/login-image.jpg";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login(email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password."); // Set the error message
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/add-ticket"); // Redirect only if the user is authenticated
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <img src={loginImage} alt="Login" className="img-fluid" />
            </div>
            {/* <h2 className="h4 text-center mb-4">Login</h2> */}
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-danger">{error}</div>}
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
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
