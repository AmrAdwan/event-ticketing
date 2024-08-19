import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const { token } = useContext(AuthContext);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [editedEventName, setEditedEventName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedVenue, setEditedVenue] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedBeginTime, setEditedBeginTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": token,
          },
        };
        const response = await axios.get(
          "http://localhost:5000/api/tickets",
          config
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [token]);

  const handleDelete = async (ticketId) => {
    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/tickets/${ticketId}`,
        config
      );
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleEditClick = (ticket) => {
    setEditingTicketId(ticket._id);
    setEditedEventName(ticket.eventName);
    setEditedDescription(ticket.description);
    setEditedVenue(ticket.venue);
    setEditedDate(new Date(ticket.date).toISOString().split("T")[0]);
    setEditedBeginTime(ticket.beginTime);
    setEditedEndTime(ticket.endTime);
    setEditedPrice(ticket.price);
    setEditedQuantity(ticket.quantity);
  };

  const handleEditSave = async (ticketId) => {
    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const updatedTicket = {
        eventName: editedEventName,
        description: editedDescription,
        venue: editedVenue,
        date: editedDate,
        beginTime: editedBeginTime,
        endTime: editedEndTime,
        price: editedPrice,
        quantity: editedQuantity,
      };
      const response = await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}`,
        updatedTicket,
        config
      );
      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? response.data : ticket
        )
      );
      setEditingTicketId(null);
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  const handleShare = (urlSlug) => {
    const shareURL = `http://localhost:3000/ticket/${urlSlug}`;
    navigator.clipboard
      .writeText(shareURL)
      .then(() => {
        alert("Ticket URL copied to clipboard: " + shareURL);
      })
      .catch((err) => {
        console.error("Failed to copy URL to clipboard:", err);
      });
  };

  return (
    <div className="container" style={{ margin: "30px" }}>
      <h2 className="mb-4" style={{ textAlign: "center" }}>
        Your Tickets
      </h2>
      <ul className="list-group">
        {tickets.map((ticket) => (
          <li
            key={ticket._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{
              // backgroundColor: "#4682B4",
              backgroundColor: "#87CEEB",
              // color: "#fff",
              color: "#2F4F4F",
              borderColor: "#D8BFD8",
              margin: "20px",
            }}
          >
            {editingTicketId === ticket._id ? (
              <div>
                <input
                  type="text"
                  value={editedEventName}
                  onChange={(e) => setEditedEventName(e.target.value)}
                />
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <input
                  type="text"
                  value={editedVenue}
                  onChange={(e) => setEditedVenue(e.target.value)}
                />
                <input
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                />
                <input
                  type="time"
                  value={editedBeginTime}
                  onChange={(e) => setEditedBeginTime(e.target.value)}
                />
                <input
                  type="time"
                  value={editedEndTime}
                  onChange={(e) => setEditedEndTime(e.target.value)}
                />
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                />
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-success mr-2"
                  style={{ margin: "10px" }}
                  onClick={() => handleEditSave(ticket._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5>{ticket.eventName}</h5>
                <p>Price: €{ticket.price}</p>
                {/* <Link
                  to={`/ticket/${ticket.urlSlug}`}
                  target="_blank"
                  className="btn btn-sm btn-outline-primary mr-2"
                >
                  View Ticket
                </Link> */}
                <Link
                  to={`/event/${ticket.urlSlug}`}
                  target="_blank"
                  className="btn btn-sm btn-outline-light mr-2"
                >
                  View Event
                </Link>
              </div>
            )}
            <div>
              <button
                className="btn btn-sm btn-outline-dark mr-2"
                style={{ margin: "10px" }}
                onClick={() => handleShare(ticket.urlSlug)}
              >
                Share
              </button>
              <button
                className="btn btn-sm btn-outline-warning mr-2"
                style={{ margin: "10px" }}
                onClick={() => handleEditClick(ticket)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                style={{ margin: "10px" }}
                onClick={() => handleDelete(ticket._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tickets;
