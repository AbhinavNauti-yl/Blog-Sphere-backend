import { Router } from "express";
import {createPost, updatePost, deletePost, getPost, getAllPost} from  "../controllers/post.controller.js"
import { varifyJwt, varifyAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const postRouter = Router()

postRouter.route("/").post(varifyJwt, varifyAdmin, createPost)
postRouter.route("/:slug").put(varifyJwt, varifyAdmin, upload.single("photo"), updatePost)
postRouter.route("/:slug").delete(varifyJwt, varifyAdmin, deletePost)
postRouter.route("/:slug").get(getPost)
postRouter.route("/").get(getAllPost)

export default postRouter