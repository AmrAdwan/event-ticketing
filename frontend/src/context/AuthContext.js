// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // New state to manage loading

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
        try {
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Error verifying token:", error);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false); // Set loading to false after check
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    setToken(response.data.token);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const register = async (name, email, password, confirmPassword) => {
    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
