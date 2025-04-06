import { Router } from "express";
import {createPost, updatePost} from  "../controllers/post.controller.js"
import { varifyJwt, varifyAdmin } from "../middleware/auth.middleware.js";

const postRouter = Router()

postRouter.route("/").post(varifyJwt, varifyAdmin, createPost)

export default postRouter