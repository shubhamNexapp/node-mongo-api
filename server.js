const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/chatUser");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// **Connect to MongoDB**
mongoose.connect("mongodb://localhost:27017/chatapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// **Active Users List**
let users = {};

// **Register API**
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const newUser = new User({ name, email, password: password });
  await newUser.save();

  res.json({ message: "User registered successfully" });
});

// **Login API**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  res.json({ userId: user._id, name: user.name });
});

// **Get Users API**
app.get("/users", async (req, res) => {
  const usersList = await User.find();
  res.json(usersList);
});

// **Get Chat History**
app.get("/messages/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
  }).sort("timestamp");

  res.json(messages);
});

// **Socket Connection**
io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("joinChat", ({ userId, name }) => {
    users[userId] = { socketId: socket.id, name };
    io.emit("userList", Object.values(users));
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const newMessage = new Message({ senderId, receiverId, message });

    console.log("newMessage=======",newMessage)
    await newMessage.save(); // ✅ Save to MongoDB

    const receiver = users[receiverId];
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", { senderId, message });
    }

    // // ✅ Also send message back to sender so they see it immediately
    // io.to(users[senderId].socketId).emit("receiveMessage", {
    //   senderId,
    //   message,
    // });
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach((userId) => {
      if (users[userId].socketId === socket.id) {
        console.log(`👋 User ${userId} disconnected`);
        delete users[userId];
      }
    });
    io.emit("userList", Object.values(users));
  });
});

server.listen(8001, () => {
  console.log("🚀 Server running on port 8001");
});
