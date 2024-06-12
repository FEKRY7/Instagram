const express = require("express");
const router = express.Router();
const { myMulter, HME } = require("../../utils/multer.js");
const {
  CreateProfile,
  CreatePost,
  getPost,
  DeleteProfile,
  DeletePost,
  UpdateProfile,
  UpdatePost,
  getProfile
} = require("./profile.controller.js");

router.post("/CreateProfile/:id", myMulter().single("image"), CreateProfile);

// router.post(
//   "/CreatePost/:id",
//   myMulter().fields([
//     { name: "image", maxCount: 1 },
//     // { name: "video", maxCount: 1 },
//   ]),
//   HME,
//   CreatePost
// );

router.post("/CreatePost/:id", myMulter().single("image"), HME, CreatePost);

router.delete("/DeleteProfile/:id", DeleteProfile);

router.delete("/DeletePost/:id", DeletePost);

router.put("/UpdateProfile/:id", myMulter().single("image"), HME, UpdateProfile);

router.put("/UpdatePost/:id", myMulter().single("image"), HME, UpdatePost);

router.get("/getPost/:id", getPost);

router.get("/getProfile/:id", getProfile);

module.exports = router;
