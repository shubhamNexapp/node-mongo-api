const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  location: [
    {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  ],
  results: { type: Array },
  role: {
    type: String,
    enum: ["individual", "company", "customer"], // Define roles here
    default: "individual",
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
