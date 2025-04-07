import mongoose, { Schema } from "mongoose";

import PostCatagories from "./PostCatogories.model.js";

const PostSchema = mongoose.Schema({
    title: { type: String, required: true},
    caption: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    body: {type: Object, required: true},
    photo: {type: String, required: false},
    user: {type: Schema.Types.Object, ref: "User"},
    tags: {type: [String]},
    catogery: {type: Schema.Types.Object, ref: PostCatagories},
},{timestamps: true, toJSON: { virtuals: true }})

PostSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post",
  });

const Post = mongoose.model("Post", PostSchema)
export default Post