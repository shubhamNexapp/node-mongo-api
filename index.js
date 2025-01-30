// index.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const locationRoutes = require("./routes/locationRoutes");
const path = require("path");

const app = express();

// Increase the request body size limit
app.use(bodyParser.json({ limit: "10mb" })); // Adjust the limit as necessary
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

app.use(
  "/profileImage",
  express.static(path.join(__dirname, "uploads/profileImage"))
);

app.use("/user", userRoutes);
app.use("/location", locationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
