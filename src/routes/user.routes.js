import { Router } from "express";
import {registerUser, loginUser, logoutUser, getProfile} from "../controllers/user.controller.js";
import { varifyJwt } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").get(loginUser)
userRouter.route("/logout").get(varifyJwt, logoutUser)
userRouter.route("/profile").get(varifyJwt, getProfile)

export default userRouter