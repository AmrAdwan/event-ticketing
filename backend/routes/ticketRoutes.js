const express = require("express");
const Ticket = require("../models/Ticket");

const authMiddleware = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// Create a new ticket (ensure the user is authenticated)
// router.post("/create", authMiddleware, async (req, res) => {
//   try {
//     const { eventName, description, venue, date, price, quantity } = req.body;

//     const urlSlug = uuidv4();

//     const ticket = new Ticket({
//       eventName,
//       description,
//       venue,
//       date,
//       price,
//       quantity,
//       user: req.user.id,
//       urlSlug,
//     });

//     await ticket.save();

//     res
//       .status(201)
//       .json({ ticket, url: `http://localhost:3000/ticket/${ticket.urlSlug}` });
//   } catch (error) {
//     console.error("Error creating ticket:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      eventName,
      description,
      venue,
      date,
      beginTime,
      endTime,
      price,
      quantity,
    } = req.body;

    const urlSlug = uuidv4();

    const ticket = new Ticket({
      eventName,
      description,
      venue,
      date,
      beginTime,
      endTime,
      price,
      quantity,
      user: req.user.id,
      urlSlug,
    });

    await ticket.save();

    res
      .status(201)
      .json({ ticket, url: `http://localhost:3000/ticket/${ticket.urlSlug}` });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get tickets for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to fetch a ticket by its urlSlug
router.get("/:urlSlug", async (req, res) => {
  try {
    console.log(req.params.urlSlug); // Log the urlSlug to ensure it's being received
    const ticket = await Ticket.findOne({ urlSlug: req.params.urlSlug });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a ticket (ensure the user is authenticated)
// router.put("/:ticketId", authMiddleware, async (req, res) => {
//   try {
//     const { eventName, description, venue, date, price, quantity } = req.body;
//     const ticket = await Ticket.findOneAndUpdate(
//       { _id: req.params.ticketId, user: req.user.id },
//       { eventName, description, venue, date, price, quantity },
//       { new: true }
//     );

//     if (!ticket) {
//       return res
//         .status(404)
//         .json({ message: "Ticket not found or not authorized" });
//     }

//     res.status(200).json(ticket);
//   } catch (error) {
//     console.error("Error updating ticket:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

router.put("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const {
      eventName,
      description,
      venue,
      date,
      beginTime,
      endTime,
      price,
      quantity,
    } = req.body;
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.ticketId, user: req.user.id },
      {
        eventName,
        description,
        venue,
        date,
        beginTime,
        endTime,
        price,
        quantity,
      },
      { new: true }
    );

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a ticket (ensure the user is authenticated)
router.delete("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.ticketId,
      user: req.user.id,
    });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
