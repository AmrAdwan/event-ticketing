// backend/routes/contactRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("message", "Message is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // Configure nodemailer
    let transporter = nodemailer.createTransport({
      service: "outlook", // or your preferred email service
      auth: {
        user: process.env.EMAIL_USER, // Add your email user in .env
        pass: process.env.EMAIL_PASS, // Add your email password in .env
      },
    });

    // Email options
    // let mailOptions = {
    //   from: email,
    //   to: process.env.EMAIL_USER, // Add the receiver email in .env
    //   subject: `Contact Form Submission from ${name}`,
    //   text: message,
    // };

    let mailOptions = {
      from: process.env.EMAIL_USER, // Use the authenticated email as the sender
      to: process.env.EMAIL_USER, // Your email address
      subject: `Contact Form Submission from ${name}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
      replyTo: email, // Set the reply-to header to the user's email
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ msg: "Message sent successfully!" });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ msg: "Failed to send the message." });
    }
  }
);

module.exports = router;
