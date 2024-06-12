const ProfileModel = require("../../../Database/models/profile.model.js");
const UserModel = require("../../../Database/models/user.model.js");
const cloudinary = require("../../utils/cloudinary.js");
const PostModel = require("../../../Database/models/post.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const CreateProfile = async (req, res) => {
  try {
    const findUser = await UserModel.findById(req.params.id);
    if (!findUser) {
      return First(res, "User Not Found", 404, http.FAIL);
    }    
    
     // Set the creator ID
     req.body.CreatBy = req.params.id; // Assuming 'createdBy' is the correct field name

    
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `InstagramProject/Profile/${findUser._id}` }
      );
      req.body.image = secure_url;
      req.body.imagePublicId = public_id;
    }

    const CreateObject = await ProfileModel.create(req.body);

    return Second(
      res,
      ["Profile created", { profile: CreateObject }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// const CreatePost = async (req, res) => {
//   try {
//     const findProfile = await ProfileModel.findById(req.params.id);
//     if (!findProfile) {
//       return res.status(404).json({ Msg: "UserProfile Not Found" });
//     }

//     if (req.files) {
//       if (req.files.image && req.files.image[0]) {
//         const { secure_url: imageUrl, public_id: imagePublicId } =
//           await cloudinary.uploader.upload(req.files.image[0].path, {
//             folder: `InstagramProject/Profile/${findProfile._id}/images`,
//           });
//         req.body.image = imageUrl;
//         req.body.imagePublicId = imagePublicId;
//       }

//     //   if (req.files.video && req.files.video[0]) {
//     //     const { secure_url: videoUrl, public_id: videoPublicId } =
//     //       await cloudinary.uploader.upload(req.files.video[0].path, {
//     //         folder: `InstagramProject/Profile/${findProfile._id}/videos`,
//     //       });
//     //     req.body.video = videoUrl;
//     //     req.body.videoPublicId = videoPublicId;
//     //   }
//     }

//     const createdPost = await PostModel.create(req.body);

//     res.status(201).json({ Msg: "Post created", post: createdPost });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ Msg: "Server Error", error: error.message });
//   }
// };

const CreatePost = async (req, res) => {
  try {
    const findProfile = await ProfileModel.findById(req.params.id);
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

const getProfile = async (req, res) => {
  try {
    const getAll = await ProfileModel.findById(req.params.id);
    return Second(res, getAll, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const getPost = async (req, res) => {
  try {
    const findProfile = await ProfileModel.findById(req.params.id);
    if (!findProfile) {
      return First(res, "UserProfile Not Found", 404, http.FAIL);
    }

    const getAll = await PostModel.findOne({CreatBy:req.params.id});

    return Second(res, getAll, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteProfile = async (req, res) => {
  try {
    const findProfile = await ProfileModel.findById(req.params.id);
    if (!findProfile) {
      return First(res, "UserProfile Not Found", 404, http.FAIL);
    }

    // Delete the Profile image from Cloudinary
    if (findProfile.imagePublicId && findProfile.image) {
      await cloudinary.uploader.destroy(findProfile.imagePublicId);
      await cloudinary.uploader.destroy(findProfile.image);
    }
    const DeleteProfile = await ProfileModel.findByIdAndDelete(req.params.id);

    return Second(
      res,
      `Profile with ID: ${req.params.id} has been deleted`,
      200,
      http.SUCCESS
    );
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

const UpdateProfile = async (req, res) => {
  try {
    const findProfile = await ProfileModel.findById(req.params.id);
    if (!findProfile) {
      return res.status(404).json({ message: "UserProfile Not Found" });
    }

    // Upload new image if provided
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `InstagramProject/Profile/${findProfile._id}` }
      );
      req.body.image = secure_url;
      req.body.imagePublicId = public_id;

      // Delete the old image from Cloudinary
      if (findProfile.imagePublicId) {
        await cloudinary.uploader.destroy(findProfile.imagePublicId);
      }
    }

    // Update the Profile with new details
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    return res
      .status(200)
      .json({
        message: `Profile with ID: ${req.params.id} has been updated`,
        profile: updatedProfile,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
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

module.exports = {
  CreateProfile,
  CreatePost,
  getPost,
  DeleteProfile,
  DeletePost,
  UpdateProfile,
  UpdatePost,
  getProfile
};
 