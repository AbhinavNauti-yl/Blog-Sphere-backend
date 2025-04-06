import mongoose, { Schema } from "mongoose";

const PostCatagoriesSchema = mongoose.Schema({
    name: { type: String, required: true},
},{timestamps: true})

const PostCatagories = mongoose.model("PostCatagories", PostCatagoriesSchema)
export default PostCatagories