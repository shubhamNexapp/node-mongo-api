const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  about: { type: String },
  city: { type: String },
  createdAt: { type: String },
  userId: { type: String },
  profile: { type: String },
  role: {
    type: String,
    enum: ["customer", "individual", "company", "admin"], // Define roles here
    default: "customer",
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

userSchema.index({ location: "2dsphere" }); // Create a geospatial index for location

const User = mongoose.model("users", userSchema);

module.exports = User;
