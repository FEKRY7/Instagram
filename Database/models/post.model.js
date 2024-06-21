const mongoose = require("mongoose");
const { Types } = mongoose;
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    CreatBy: [
      {
        type: Types.ObjectId,
        ref: "Profile"
      },
    ],
    createdAtMinutes: {
      type: Date,
      default: Date.now,
    },
    image: String,
    imagePublicId: String,
    video: String,
    videoPublicId: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
