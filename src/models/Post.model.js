import mongoose, { Schema } from "mongoose";

import PostCatagories from "./PostCatogories.model.js";

const PostSchema = mongoose.Schema({
    title: { type: String, required: true},
    caption: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    body: {type: Object, required: true},
    photo: {type: String, required: true},
    user: {type: Schema.Types.Object, ref: "User"},
    tags: {type: [String]},
    catogery: {type: Schema.Types.Object, ref: PostCatagories},
},{timestamps: true})

const Post = mongoose.model("Post", PostSchema)
export default Post