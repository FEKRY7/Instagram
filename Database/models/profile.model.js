const mongoose = require("mongoose");
const { Types } = mongoose;
const ProfileSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    CreatBy: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    image: String,
    imagePublicId: String,
  },
  { timestamps: true }
);

const ProfileModel = mongoose.model("Profile", ProfileSchema);

module.exports = ProfileModel;
