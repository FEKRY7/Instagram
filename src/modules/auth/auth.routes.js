const express = require("express");
const router = express.Router();
const { validation } = require("./../../middleware/validation.middleware.js");

const multer = require("multer");
const path = require("path");

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the upload directory path is correct
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    // Generate a random file name
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const finalName = `${uniqueSuffix}${fileExtension}`;
    cb(null, finalName);
  },
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType !== "image") {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

// Create multer instance with storage and file filter configurations
const upload = multer({ storage: storage, fileFilter: fileFilter });

const {
  SignUpSchema,
  activateAcountSchema,
  signInSchema,
} = require("./auth.schema..js");
const {
  SignUp,
  activeAccount,
  signIn,
  Logout,
  updateUser
} = require("./auth.controller.js");

router.post(
  "/SignUp",
  upload.single("avatar"),
  validation(SignUpSchema),
  SignUp
);

router.get(
  "/activat_account/:token",
  validation(activateAcountSchema),
  activeAccount
);

router.post(
  "/signIn",
  upload.single("avatar"),
  validation(signInSchema),
  signIn
);

router.post("/logout/:id", Logout);

router.put('/update/:id',updateUser)

module.exports = router;