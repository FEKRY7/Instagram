const messageModel = require("../../../Database/models/messageModel");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();
    return Second(res, response, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await messageModel.find({ chatId });
    return Second(res, message, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createMessage,
  getMessage,
};
