// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authMiddleware = require("../middleware/authMiddleware");

// // Create a Stripe account for a user
// router.post("/create-stripe-account", async (req, res) => {
//   try {
//     // Create a new Stripe account for the user
//     const account = await stripe.accounts.create({
//       type: "express", // or 'custom' if you need more control
//       country: "NL",
//       email: req.body.email,
//     });

//     // Save the account ID to the user's profile in your database
//     const user = await User.findById(req.user.id);
//     user.stripeAccountId = account.id;
//     await user.save();

//     res.status(200).json({ accountId: account.id });
//   } catch (error) {
//     console.error("Error creating Stripe account:", error);
//     res.status(500).json({ message: "Error creating Stripe account" });
//   }
// });

// // Generate a link to complete the Stripe onboarding process

// router.get("/stripe-onboarding-link", authMiddleware, async (req, res) => {
//   try {
//     if (!req.user || !req.user.stripeAccountId) {
//       // If the user's stripeAccountId is missing, return a 400 error
//       return res.status(400).json({ message: "Missing Stripe Account ID" });
//     }

//     const accountLink = await stripe.accountLinks.create({
//       account: req.user.stripeAccountId,
//       refresh_url: "http://localhost:3000/retry",
//       return_url: "http://localhost:3000/account",
//       type: "account_onboarding",
//     });

//     res.status(200).json({ url: accountLink.url });
//   } catch (error) {
//     console.error("Error generating Stripe onboarding link:", error);
//     res
//       .status(500)
//       .json({ message: "Error generating Stripe onboarding link" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middleware/authMiddleware");

// Generate a link to complete the Stripe onboarding process
router.get("/stripe-onboarding-link", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a Stripe account
    if (!user.stripeAccountId) {
      // Create a new Stripe account for the user
      const account = await stripe.accounts.create({
        type: "express",
        country: "NL",
        email: user.email,
      });

      // Save the account ID to the user's profile in your database
      user.stripeAccountId = account.id;
      await user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: "http://localhost:3000/retry",
      return_url: "http://localhost:3000/account",
      type: "account_onboarding",
    });

    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    console.error("Error generating Stripe onboarding link:", error);
    res
      .status(500)
      .json({ message: "Error generating Stripe onboarding link" });
  }
});

module.exports = router;
