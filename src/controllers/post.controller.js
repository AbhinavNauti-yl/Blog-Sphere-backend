import { asyncHandeler } from "../utils/asyncHandeler.js";
import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import { v4 as uuidv4 } from "uuid";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import path from "path";

const createPost = asyncHandeler(async (req, res, next) => {
  const post = new Post({
    title: "sample post",
    caption: "sample captiom",
    slug: uuidv4(),
    body: {
      type: "doc",
      content: [],
    },
    user: req.user._id,
  });

  const response = await post.save();

  if (!response) throw new apiError(500, "could not create post");

  res.status(200).json(new apiResponse(200, response, "post created"));
});

const updatePost = asyncHandeler(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params?.slug });
  if (!post) throw new apiError(500, "post dose not exist");

  const postPhotoLocalPath = req?.file?.path;
  let oldPhoto = post.photo || null;
  let url = "";
  if (postPhotoLocalPath !== undefined) {
    url = await uploadToCloudinary(postPhotoLocalPath);
    if (url != "" && oldPhoto) {
      await deleteFromCloudinary(oldPhoto);
    }
  } else {
    url = null
  }

  const { title, caption, slug, body, tags, categories } = JSON.parse(
    req.body?.document
  );
  post.title = title || post.title;
  post.caption = caption || post.caption;
  post.slug = slug || post.slug;
  post.body = body || post.body;
  post.tags = tags || post.tags;
  post.categories = categories || post.categories;
  post.photo = url == null ? oldPhoto : url;
  await post.save();

  const updatedPost = await Post.findById(post._id);

  if (!updatedPost) throw new apiError(500, "post could not be updated");

  res
    .status(200)
    .json(new apiResponse(200, updatedPost, "updated succesfully"));
});

const deletePost = asyncHandeler(async (req, res, next) => {
  const post = await Post.findOneAndDelete({ slug: req.params?.slug });

  if (!post) throw new apiError(400, "post dose not exist");

  await deleteFromCloudinary(post.photo);
  await Comment.deleteMany({ post: post._id });

  res.status(200).json(new apiResponse(200, post, "post deleted"));
});

const getPost = asyncHandeler(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params?.slug }).populate([
    {
      path: "user",
      select: ["avatar", "name"],
    },
    {
      path: "categories",
      select: ["title"],
    },
    {
      path: "comments",
      match: {
        check: true,
        parent: null,
      },
    },
  ]);

  if (!post) throw new apiError(400, "post dose not exist");

  res.status(200).json(new apiResponse(200, post, "post found"));
});

const getAllPost = asyncHandeler(async (req, res, next) => {
  let filter = req?.query?.search;
  let where = {};
  if (filter) {
    where.title = { $regex: filter,  $options: "i" };
  }
  let query = Post.find(where);
  const page = parseInt(req.query?.page) || 1;
  const pageSize = parseInt(req.query?.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const total = await Post.find(where).countDocuments();
  const pages = Math.ceil(total / pageSize);

  // if (page > pages) {
  //   throw new apiError(500, "no pages found");
  // }
  
  const posts = await query
    .skip(skip)
    .limit(pageSize)
    .populate([
      {
        path: "user",
        select: ["avatar", "name", "varified"],
      },
      {
        path: "categories",
        select: ["title"],
      },
    ])
    .sort({ updatedAt: "desc" });

  res
    .status(200)
    .header({
      "x-filetr": filter,
      "x-totalCount": JSON.stringify(total),
      "x-currentPage": JSON.stringify(page),
      "x-pageSize": JSON.stringify(pageSize),
      "x-totalPagesCount": JSON.stringify(pages),
    })
    .json(new apiResponse(200, posts.length != 0 ? posts : [], "all posts"))
});

export { createPost, updatePost, deletePost, getPost, getAllPost };
