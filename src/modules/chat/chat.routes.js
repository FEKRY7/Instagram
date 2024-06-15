const express = require('express');
const router = express.Router();
const { createChat, findUserChats, findChat } = require("./chat.controller.js"); // Removed unnecessary comma

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat); // Removed unnecessary comma

module.exports = router; // Exporting the router for use in other files
