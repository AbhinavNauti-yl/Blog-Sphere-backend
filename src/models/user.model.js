import { Schema, model } from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const UserSchema = Schema({
    name:{
        type: String,
        requred: true,
    },
    avatar:{
        type: String,
        default: ""
    },
    email: {
        type: String,
        requied: true,
    },
    password: {
        type: String,
        required: true,
    },
    varified: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null,
    }
}, {timestamps: true})

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


// UserSchema.methods.generateJWT = async function() {
//     return jwt.sign(
//         {
//             _id: this._id
//         },
//         process.env.JWTKEY,
//         {
//             expiresIn: "30d"
//         },
//     )
// }

UserSchema.methods.genereateAccessToken = async function() {
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.genereateRefeshToken = async function() {
    return jwt.sign(
        {
            _id: this.id,
            name: this.name,
            email: this.email,
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = model("User", UserSchema)