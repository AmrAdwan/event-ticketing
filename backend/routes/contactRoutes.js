const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Please include a valid phone number").matches(
      /^\+?[0-9]{10,15}$/
    ),
    check("message", "Message is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    // Configure nodemailer
    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_USER, // Use the authenticated email as the sender
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${name}`,
      text: `You have received a new message from ${name} (${email}, ${phone}):\n\n${message}`,
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
