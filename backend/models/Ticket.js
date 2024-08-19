// backend/models/Ticket.js
const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  urlSlug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
});

module.exports = mongoose.model("Ticket", TicketSchema);
