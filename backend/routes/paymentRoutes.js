// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Ticket = require("../models/Ticket");

// router.post("/create-payment-intent", async (req, res) => {
//   const { ticketId } = req.body;

//   try {
//     const ticket = await Ticket.findById(ticketId);

//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: ticket.price * 100,
//       currency: "eur",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Ticket = require("../models/Ticket");

router.post("/create-payment-intent", async (req, res) => {
  const { ticketId, quantity } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const amount = ticket.price * quantity * 100; // Calculate the total amount in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
