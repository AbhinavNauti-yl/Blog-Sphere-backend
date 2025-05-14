import jwt from 'jsonwebtoken'

import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";

export const varifyJwt = asyncHandeler( async (req, res, next) => {
    const accessToken = req?.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ", "")

    if(!accessToken) {
        throw new apiError(401, "unauthorized access")
    }

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY)
    const user = await User.findById(decodedAccessToken._id)

    if(!user) throw new apiError(500, "something went wrong")
    req.user = user

    next()

})

export const varifyAdmin = asyncHandeler( async (req, res, next) => {
    const user = req?.user

    if(user.admin != true) {
        throw new apiError(500, "User is not admin")
    }

    next()
})