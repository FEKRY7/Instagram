// const ProfileModel = require("../../../Database/models/profile.model.js");
const cloudinary = require("../../utils/cloudinary.js");
const PostModel = require("../../../Database/models/post.model.js");
const UserModel = require("../../../Database/models/user.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");


const CreatePost = async (req, res) => {
  try {
    const findProfile = await UserModel.findById(req.params.id);
    if (!findProfile) {
      return First(res, "UserProfile Not Found", 404, http.FAIL);
    }
       // Set the creator ID
    req.body.CreatBy = req.params.id; // Assuming 'createdBy' is the correct field name

    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `InstagramProject/Post/${findProfile._id}/images` }
      );
      req.body.image = secure_url;
      req.body.imagePublicId = public_id;
    }

    const createdPost = await PostModel.create(req.body);

    return Second(
      res,
      ["Post created", { post: createdPost }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const getPost = async (req, res) => {
  try {
    const findProfile = await UserModel.findById(req.params.id);
    if (!findProfile) {
      return First(res, "UserProfile Not Found", 404, http.FAIL);
    }

    const getAll = await PostModel.find({CreatBy:req.params.id});
    
    return Second(res, getAll, 200, http.SUCCESS);
  
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const DeletePost = async (req, res) => {
  try {
    const findPost = await PostModel.findById(req.params.id);
    if (!findPost) {
      return First(res, "UserPost Not Found", 404, http.FAIL);
    }

    // Delete the Profile image from Cloudinary
    if (findPost.imagePublicId && findPost.image) {
      await cloudinary.uploader.destroy(findPost.imagePublicId);
      await cloudinary.uploader.destroy(findPost.image);
    }

    const DeletePost = await PostModel.findByIdAndDelete(req.params.id);

    return Second(
      res,
      `Post with ID: ${req.params.id} has been deleted`,
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const UpdatePost = async (req, res) => {
  try {
    const findPost = await PostModel.findById(req.params.id);
    if (!findPost) {
      return First(res, "UserPost Not Found", 404, http.FAIL);
    }

    // Upload new images
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `InstagramProject/Post/${findPost._id}/images` }
      );
      req.body.image = secure_url;
      req.body.imagePublicId = public_id;

      // Delete the old image from Cloudinary
      if (findPost.imagePublicId) {
        await cloudinary.uploader.destroy(findPost.imagePublicId);
      }
    }

    // Update the Post with new details
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true } // Return the updated document
    );

    return Second(
      res,
      [`Post with ID: ${req.params.id} has been updated`, updatedPost],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAllPost = async (req, res) => {
  try {
    const getAll = await PostModel.find();
    return Second(res, getAll, 200, http.SUCCESS);
    
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreatePost,
  getPost,
  DeletePost,
  UpdatePost,
  getAllPost
};
 
