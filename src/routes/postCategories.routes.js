import { Router } from "express";
import { createPostCategory, deletePostCategory, getAllPostCategory, getPostCategory, updatePostCategory } from "../controllers/postCategory.controller.js";
import { varifyJwt, varifyAdmin } from "../middleware/auth.middleware.js";

const PostCatagoriesRouter = Router()

PostCatagoriesRouter.route("/").post(varifyJwt, varifyAdmin, createPostCategory)
PostCatagoriesRouter.route("/").get( getAllPostCategory)
PostCatagoriesRouter.route("/:postCategoryId").put(varifyJwt, varifyAdmin, updatePostCategory)
PostCatagoriesRouter.route("/:postCategoryId").delete(varifyJwt, varifyAdmin, deletePostCategory)
PostCatagoriesRouter.route("/:postCategoryId").get(varifyJwt, varifyAdmin, getPostCategory)

export default PostCatagoriesRouter