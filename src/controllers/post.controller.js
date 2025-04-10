import { asyncHandeler } from "../utils/asyncHandeler.js";
import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import { v4 as uuidv4 } from "uuid";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
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
    let oldPhoto = post.photo || null
    let url = "";
    if (postPhotoLocalPath) {
        url = await uploadToCloudinary(postPhotoLocalPath);
        if(url != ""  && oldPhoto) {
            await deleteFromCloudinary(oldPhoto)
        }
    }

    const { title, caption, slug, body, tags, categories } = JSON.parse(req.body?.document);
    post.title = title || post.title;
    post.caption = caption || post.caption;
    post.slug = slug || post.slug;
    post.body = body || post.body;
    post.tags = tags || post.tags;
    post.categories = categories || post.categories;
    post.photo = url
    await post.save();

    const updatedPost = await Post.findById(post._id)

    if(!updatedPost) throw new apiError(500, "post could not be updated");

    res.status(200).json(new apiResponse(200, updatedPost, "updated succesfully"))
});

const deletePost = asyncHandeler( async (req, res, next) => {
    const post = await Post.findOneAndDelete({slug: req.params?.slug})
    
    if(!post) throw new apiError(400, "post dose not exist");

    await deleteFromCloudinary(post.photo)
    await Comment.deleteMany({post: post._id})

    res.status(200).json(new apiResponse(200, post, "post deleted"))

})

const getPost = asyncHandeler( async (req, res, next) => {
    const post = await Post.findOne({slug: req.params?.slug}).populate([
        {
            path: "user",
            select: ["avatar", "name"]
        },
        {
            path: "comments",
            match: {
                check: true,
                parent: null
            }
        }
    ])

    if(!post) throw new apiError(400, "post dose not exist");

    res.status(200).json(new apiResponse(200, post, "post found"))

})

const getAllPost = asyncHandeler( async (req, res, next) => {
    const posts  = await Post.find({}).populate([
        {
            path: "user",
            select: ["avatar", "name", "varified"],
        }
    ])

    if(!posts) throw new apiError(500, "could not fetch Posts");

    res.status(200).json(new apiResponse(200, posts, "all posts"))
})


export { createPost, updatePost, deletePost, getPost, getAllPost };
