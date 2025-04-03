const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.chatmessage || mongoose.model("chatmessage", messageSchema);

module.exports = Message;
