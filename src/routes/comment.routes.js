import { Router } from "express";
import { varifyAdmin, varifyJwt } from "../middleware/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";


const commentRouter = Router()

commentRouter.route("/").post(varifyJwt, varifyAdmin, createComment)

export default commentRouter