// index.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const locationRoutes = require("./routes/locationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

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

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

const users = {}; // Store connected users

// WebSocket Connection
// io.on("connection", (socket) => {
//   console.log(`⚡ User Connected: ${socket.id}`);

//   // User joins the chat
//   socket.on("joinChat", (userData) => {
//     const { userId, username } = userData;
    
//     users[userId] = { socketId: socket.id, username };
//     console.log(`👤 ${username} joined with socket ID: ${socket.id}`);

//     io.emit("userList", Object.values(users)); // Update user list for all
//   });

//   // Handle private messages
//   socket.on("privateMessage", ({ senderId, receiverId, message }) => {
//     const receiver = users[receiverId]; // Get receiver's socket ID

//     if (receiver) {
//       io.to(receiver.socketId).emit("newMessage", { senderId, message });
//       console.log(`📩 Message sent from ${senderId} to ${receiverId}: ${message}`);
//     } else {
//       console.log(`❌ User ${receiverId} not found!`);
//     }
//   });

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log(`❌ User Disconnected: ${socket.id}`);

//     // Remove the disconnected user
//     Object.keys(users).forEach((userId) => {
//       if (users[userId].socketId === socket.id) {
//         console.log(`👋 Removing user: ${users[userId].username}`);
//         delete users[userId];
//       }
//     });

//     io.emit("userList", Object.values(users)); // Update user list
//   });
// });

app.use(
  "/profileImage",
  express.static(path.join(__dirname, "uploads/profileImage"))
);

app.use("/user", userRoutes);
app.use("/location", locationRoutes);
app.use("/chat", chatRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
