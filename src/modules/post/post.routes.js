const express = require("express");
const router = express.Router();
const { myMulter, HME } = require("../../utils/multer.js");
const {
  CreatePost,
  getPost,
  DeletePost,
  UpdatePost,
} = require("./profile.controller.js");


router.post("/CreatePost/:id", myMulter().single("image"), HME, CreatePost);

router.delete("/DeletePost/:id", DeletePost);

router.put("/UpdatePost/:id", myMulter().single("image"), HME, UpdatePost);

router.get("/getPost/:id", getPost);



module.exports = router;
