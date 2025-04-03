const mongoose = require("mongoose");

const chatUserSchema = new mongoose.Schema({
  uid: String,
  name: String,
  email: String,
  createdAt: String,
  password: String,
});

const ChatUser =
  mongoose.models.chatuser || mongoose.model("chatuser", chatUserSchema);

module.exports = ChatUser;
