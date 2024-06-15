const chatModel = require("../../../Database/models/chatModel.js");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    // Check if a chat already exists between the two users
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).json(chat); // Fixed syntax: changed comma to dot
    }

    // If no chat exists, create a new one
    const newChat = new chatModel({
      members: [firstId, secondId], // Fixed: changed $all to an array of members
    });

    const response = await newChat.save();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" }); // Handling errors
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    createChat,
    findUserChats,
    findChat
}