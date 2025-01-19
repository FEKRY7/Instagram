const jwt = require("jsonwebtoken");
const tokenModel = require("../../../Database/models/tokenModel.js");
const UserModel = require("../../../Database/models/user.model.js");
const bcryptjs = require("bcrypt");
const sendEmail = require("../../utils/sendEmail.js");
const signUpTemplate = require("../../utils/htmlTemplets.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const SignUp = async (req, res) => {
  try {
    // making sure that the used email dosent exist
    const isUser = await UserModel.findOne({ email: req.body.email });
    if (isUser) {
      return First(res, "User already existed", 409, http.FAIL);
    }
    // hashing the password
    req.body.password = bcryptjs.hashSync(req.body.password, 8);
    // Creating the token
    const token = jwt.sign(
      { email: req.body.email, id: req.body._id },
      process.env.JWT_SECRET_KEY
    );

    // Handle avatar
    if (req.file && req.file.filename) {
      req.body.avatar = req.file.filename;
    }

    // Creating the user
    const user = await UserModel.create(req.body);
    const html = signUpTemplate(
      `https://instagram-4.onrender.com/api/auth/activat_account/${token}`
    );
    const messageSent = await sendEmail({
      to: user.email,
      subject: "Account Activation",
      html,
    });
    if (!messageSent) {
      return First(res, "Failed to send activation email.", 400, http.FAIL);
    }
    Second(
      res,
      ["User Created , Pleasr activate your account", token],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const activeAccount = async (req, res) => {
  try {
    // receving the token from the params
    const { token } = req.params;
    // decoding the token to get the payload
    const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Searching for the user in DataBase
    const isUser = await UserModel.findOneAndUpdate(
      { email: payLoad.email },
      { confirmEmail: true },
      { new: true }
    );
    if (!isUser) {
      return First(res, "User not found.", 404, http.FAIL);
    }

    Second(
      res,
      ["Account Activated , Try to login ", isUser],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const signIn = async (req, res) => {
  try {
    // distructing the req.body
    const { email, password } = req.body;
    // searching for the user in database
    const isUser = await UserModel.findOne({ email });
    if (!isUser) {
      return First(res, "Invalid Email", 404, http.FAIL);
    }
    // making sure that the user has activated the account
    if (!isUser.confirmEmail) {
      return First(res, "Please Confirm your email", 400, http.FAIL);
    }
    // comparing the hashed password with the req.body password
    const match = await bcryptjs.compare(password, isUser.password);
    console.log(isUser);
    // sending a response if the passwords dosent match
    if (!match) {
      return First(res, "Invalid password", 400, http.FAIL);
    }
    // creating a token for using it in authentication and autorization
    const token = jwt.sign(
      { email, id: isUser._id },
      process.env.JWT_SECRET_KEY
    );
    // saving the token in token model (this an  optional  step)
    await tokenModel.create({ token, user: isUser._id });

    await UserModel.updateMany(
      { _id: isUser._id },
      { $set: { isActive: true } }
    );
    // sending the response
    return Second(
      res,
      [
        "you are loggedin",
        { token: token },
        {
          _id: isUser._id,
          firstName: isUser.firstName,
          lastName: isUser.lastName,
          email: isUser.email,
        },
      ],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const Logout = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return First(res, "User not found", 400, http.FAIL);
    }

    await UserModel.updateMany(
      { _id: user._id },
      { $set: { isActive: false } }
    );

    return Second(res, "Successfully logged out", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await UserModel
      .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!user) {
      return First(res, "User not found or failed to update", 404, http.FAIL);
    } else {
      return Second(res, "User updated", 200, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


module.exports = {
  SignUp,
  activeAccount,
  signIn,
  Logout,
  updateUser
};
