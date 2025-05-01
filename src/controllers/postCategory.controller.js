import PostCategories from "../models/PostCategories.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import Post from "../models/Post.model.js";

const createPostCategory = asyncHandeler(async (req, res, next) => {
  const { title } = req.body;
  const postCategory = await PostCategories.findOne({ title });
  if (postCategory) {
    throw new apiError(500, "post category allready exist");
  }

  const newPostCategory = new PostCategories({
    title: title,
  });
  const savedPostCategory = await newPostCategory.save();
  if (!savedPostCategory)
    throw new apiError(500, "could not create post category");

  res
    .status(201)
    .json(new apiResponse(201, savedPostCategory, "new post Category created"));
});

const getAllPostCategory = asyncHandeler(async (req, res, next) => {
  const postCategories = await PostCategories.find({});
  if (!postCategories) {
    throw new apiError(404, "no post Category found");
  }

  res
    .status(200)
    .json(new apiResponse(200, postCategories, "all Post Categories"));
});

const updatePostCategory = asyncHandeler(async (req, res, next) => {
  const { title } = req.body;
  const updatedPostCategory = await PostCategories.findByIdAndUpdate(
    req.params.postCategoryId,
    {
      title,
    },
    {
      new: true,
    }
  );

  if (!updatedPostCategory)
    throw new apiError(500, "post could not be updated");

  res
    .status(200)
    .json(new apiResponse(200, updatedPostCategory, "post updated"));
});

const deletePostCategory = asyncHandeler(async (req, res, next) => {
  const categoryId = req.params.postCategoryId;

  await Post.updateMany(
    { categories: { $in: [categoryId] } },
    { $pull: { categories: categoryId } }
  );

  const response = await PostCategories.deleteOne({ _id: categoryId });
  if (!response) throw new apiError(500, "could not delete Post category");
  res.status(200).json(new apiResponse(200, response, "deleted Post category"));
});

export {
  createPostCategory,
  getAllPostCategory,
  updatePostCategory,
  deletePostCategory,
};
