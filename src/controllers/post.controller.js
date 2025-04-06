import { asyncHandeler } from "../utils/asyncHandeler.js";
import Post from "../models/Post.model.js"
import {v4 as uuidv4} from "uuid"
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const createPost = asyncHandeler( async (req, res, next) => {
    const post = new Post({
        title: "sample post",
        caption: "sample captiom",
        slug: uuidv4(),
        body: {
            type: "doc",
            content: []
        },
        photo: "hello",
        user: req.user._id,
    })

    const response = await post.save()

    if(!response) throw new apiError(500, "could not create post");

    res.status(200).json(new apiResponse(200, response, "post created"))
})

const updatePost = asyncHandeler( async (req, res, next) => {
    const post = await Post.findOne({slug: req.params?.slug})
    if(!post) throw new apiError(500, "post dose not exist")
})


export {createPost, updatePost}