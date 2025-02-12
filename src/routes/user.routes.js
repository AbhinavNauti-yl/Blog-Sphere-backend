import { Router } from "express";

const userRouter = Router()

userRouter.route("/register").get((req, res) => {
    res.send("uer route check")
})

export default userRouter