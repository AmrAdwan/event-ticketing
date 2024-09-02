import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AddTicket from "./components/AddTicket";
import Tickets from "./components/Tickets";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Account from "./components/UserProfile";
import OrderSuccess from "./components/OrderSuccess";
import PurchaseTicket from "./components/PurchaseTicket";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import EventDetails from "./components/EventDetails";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-dark text-light min-vh-100">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/add-ticket"
                element={
                  <PrivateRoute>
                    <AddTicket />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <Account />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tickets"
                element={
                  <PrivateRoute>
                    <Tickets />
                  </PrivateRoute>
                }
              />
              <Route path="/event/:urlSlug" element={<EventDetails />} />
              <Route path="/ticket/:urlSlug" element={<PurchaseTicket />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
