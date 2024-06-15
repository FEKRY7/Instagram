const express = require('express');
const router = express.Router();
const { createMessage, getMessage } = require('./message.controler.js')

router.post("/", createMessage);
router.get("/:chatId", getMessage);

module.exports = router;
