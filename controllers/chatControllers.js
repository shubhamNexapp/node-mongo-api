const ChatUser = require("../models/chatUser");
const Message = require("../models/message");

const addUser = async (req, res) => {
  try {
    const { uid, name, email } = req.body;

    let UserData = new ChatUser({
      uid,
      name,
      email,
      createdAt: new Date(),
    });

    UserData.userId = UserData._id;

    let saveData = await UserData.save();

    res.json({ message: "User added!", data: saveData });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Failed to add location", error });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await ChatUser.find();
    res.json(users);
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Failed to add location", error });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Failed to add location", error });
  }
};

module.exports = {
  addUser,
  getUser,
  getMessages,
};
