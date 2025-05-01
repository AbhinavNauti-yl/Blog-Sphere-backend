import { Router } from "express";
import {registerUser, loginUser, logoutUser, getProfile, updateProfile, deleteProfileAvatar, updateProfileAvatar} from "../controllers/user.controller.js";
import { varifyJwt } from "../middleware/auth.middleware.js";
import {upload} from '../middleware/multer.middleware.js'

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").get(varifyJwt, logoutUser)
userRouter.route("/profile").get(varifyJwt, getProfile)
userRouter.route("/updateProfile").post(
    varifyJwt,
    updateProfile,
)
userRouter.route("/updateProfileAvatar").post(
    varifyJwt,
    upload.single("avatar"),
    updateProfileAvatar,
)
userRouter.route("/deleteProfileAvatar").get(
    varifyJwt,
    deleteProfileAvatar
)

export default userRouter