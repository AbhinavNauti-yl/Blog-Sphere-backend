import { asyncHandeler } from "../utils/asyncHandeler.js";

import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const createComment = asyncHandeler( async (req, res, next) => {
    const {desc, slug, parent, replyOnUser} = req.body

    const post = await Post.findOne({slug: slug})
    if(!post) throw new apiError(400, "post dose not exist")

    const comment = new Comment({
        user: req?.user?._id,
        desc,
        post: post._id,
        parent,
        replyOnUser,
    })

    const response = await comment.save()
    console.log(response)

    res.status(200).json(new apiResponse(200, comment, "comment created"))
})

export {createComment}