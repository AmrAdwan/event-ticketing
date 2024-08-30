// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Ticket = require("../models/Ticket");

// router.post("/create-payment-intent", async (req, res) => {
//   const { ticketId, quantity } = req.body;

//   try {
//     const ticket = await Ticket.findById(ticketId);
//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     const amount = ticket.price * quantity * 100; // Calculate the total amount in cents

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
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

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Ticket = require("../models/Ticket");
const User = require("../models/User");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { ticketId, quantity } = req.body;

    // Fetch the ticket from the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      // console.error("Ticket not found:", ticketId);
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Fetch the seller (user who owns the ticket) from the database
    const seller = await User.findById(ticket.user);
    // console.log("Fetched seller:", seller); // Log entire user object

    if (!seller) {
      // console.error("Seller not found for user ID:", ticket.user);
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.stripeAccountId) {
      // console.error("stripeAccountId missing for user ID:", seller._id);
      return res.status(404).json({ message: "stripeAccountId missing" });
    }

    // Ensure the Stripe account is valid and capable of accepting transfers
    try {
      const account = await stripe.accounts.retrieve(seller.stripeAccountId);
      // console.log("Stripe account retrieved:", account); // Log account details

      if (account.requirements.currently_due.length > 0) {
        console.error(
          "Stripe account is not fully set up:",
          account.requirements.currently_due
        );
        return res
          .status(400)
          .json({ message: "Stripe account is not fully set up." });
      }
    } catch (err) {
      console.error("Error retrieving Stripe account:", err);
      return res.status(400).json({ message: "Invalid Stripe account ID." });
    }

    // Calculate total amount and platform fee
    const totalAmount = ticket.price * quantity;
    const platformFee = totalAmount * 0.1; // 10% fee for platform
    const totalAmountWithFee = totalAmount + platformFee; // Total amount user should pay including service fee

    // Create the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountWithFee * 100, // Convert to cents
      currency: "eur",
      application_fee_amount: platformFee * 100, // Platform fee in cents
      transfer_data: {
        destination: seller.stripeAccountId, // Seller's Stripe account ID
      },
    });

    // Send client secret to frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
