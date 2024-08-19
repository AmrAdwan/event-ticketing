const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Allow requests from device
      "http://192.168.178.24:3000", // Allow requests from devices using same Ip address
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-auth-token"], // Allow the x-auth-token header
  })
);

// app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use(
  "/api/tickets",
  (req, res, next) => {
    console.log("Request received on /api/tickets");
    next();
  },
  require("./routes/ticketRoutes")
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
