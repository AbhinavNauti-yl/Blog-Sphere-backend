import mongoose, { Schema } from "mongoose";

const PostCategoriesSchema = mongoose.Schema({
    title: { type: String, required: true},
},{timestamps: true})

const PostCategories = mongoose.model("PostCategories", PostCategoriesSchema)
export default PostCategories