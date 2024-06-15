const chatModel = require("../../../Database/models/chatModel.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");


const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    // Check if a chat already exists between the two users
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) { 
    return Second(res, chat, 200, http.SUCCESS);// Fixed syntax: changed comma to dot
    }

    // If no chat exists, create a new one
    const newChat = new chatModel({
      members: [firstId, secondId], // Fixed: changed $all to an array of members
    });

    const response = await newChat.save();
    return Second(res, response, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    return Second(res, chats, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    return Second(res, chat, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
    createChat,
    findUserChats,
    findChat
}
