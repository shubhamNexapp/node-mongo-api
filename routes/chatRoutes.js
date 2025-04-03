const express = require("express");
const router = express.Router();
const { addUser, getUser,getMessages } = require("../controllers/chatControllers");

router.post("/addUser", addUser);

router.get("/getusers", getUser);

router.get("/getMessages", getMessages);


module.exports = router;
