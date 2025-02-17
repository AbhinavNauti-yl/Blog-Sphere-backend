import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from 'jsonwebtoken'

export const varifyJwt = asyncHandeler( async (req, res, next) => {
    const accessToken = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ", "")

    if(!accessToken) {
        throw new apiError(401, "unauthorized access")
    }

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY)
    const user = await User.findById(decodedAccessToken._id)

    if(!user) throw new apiError(500, "something went wrong")
    req.user = user

    next()

})

