const express = require("express");
const router = express.Router();
const { myMulter, HME } = require("../../utils/multer.js");
const {
  CreatePost,
  getPost,
  DeletePost,
  UpdatePost,
  getAllPost
} = require("./post.controller.js");


router.post("/CreatePost/:id/:cc", myMulter().single("image"), HME, CreatePost);

router.delete("/DeletePost/:id", DeletePost);

router.patch("/UpdatePost/:id", myMulter().single("image"), HME, UpdatePost);

router.get("/getPost/:id", getPost);
router.get("/getAllPost", getAllPost);
module.exports = router;
