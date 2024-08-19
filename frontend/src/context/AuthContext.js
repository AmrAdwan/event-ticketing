import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      axios
        .get("http://localhost:5000/api/auth/me")
        // .get("http://192.168.178.24:5000/api/auth/me")
        .then((response) => setUser(response.data))
        .catch(() => setToken(null));
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      // const response = await axios.post(
      //   "http://192.168.178.24:5000/api/auth/login",
      //   {
      email,
      password,
    });
    setToken(response.data.token);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const register = async (name, email, password) => {
    await axios.post("http://localhost:5000/api/auth/register", {
      // await axios.post("http://192.168.178.24:5000/api/auth/register", {
      name,
      email,
      password,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
