// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authMiddleware = require("../middleware/authMiddleware");
// const bcrypt = require("bcryptjs");

// // Generate a link to complete the Stripe onboarding process
// router.get("/stripe-onboarding-link", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the user already has a Stripe account
//     if (!user.stripeAccountId) {
//       // Create a new Stripe account for the user
//       const account = await stripe.accounts.create({
//         type: "express",
//         country: "NL",
//         email: user.email,
//       });

//       // Save the account ID to the user's profile in your database
//       user.stripeAccountId = account.id;
//       await user.save();
//     }

//     const accountLink = await stripe.accountLinks.create({
//       account: user.stripeAccountId,
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
// // Update user profile
// router.put("/profile", authMiddleware, async (req, res) => {
//   const { name, email, bankAccount, password } = req.body;

//   try {
//     // Find the user
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if email is taken
//     if (email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Email already in use" });
//       }
//       user.email = email;
//     }

//     // Update the user's details
//     user.name = name || user.name;
//     user.bankAccount = bankAccount || user.bankAccount;

//     // Hash new password if provided
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     // Save the updated user
//     await user.save();

//     res.json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

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

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email, bankAccount, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    user.name = name || user.name;

    // Hash new password if provided
    if (password) {
      console.log("Updating password for user:", user.id);
      user.password = password; // This will trigger the pre-save hook to hash the password
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
