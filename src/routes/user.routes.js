import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  deleteProfileAvatar,
  updateProfileAvatar,
  getAllUsers,
} from "../controllers/user.controller.js";
import { varifyAdmin, varifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(varifyJwt, logoutUser);
userRouter.route("/profile").get(varifyJwt, getProfile);
userRouter.route("/updateProfile").post(varifyJwt, updateProfile);
userRouter
  .route("/updateProfileAvatar")
  .post(varifyJwt, upload.single("avatar"), updateProfileAvatar);
userRouter.route("/deleteProfileAvatar").get(varifyJwt, deleteProfileAvatar);
userRouter.route("/getAllUsers").get(varifyJwt, varifyAdmin, getAllUsers);
export default userRouter;
