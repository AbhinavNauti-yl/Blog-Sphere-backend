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
    admin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password)
}


UserSchema.methods.generateJWT = async function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.JWTKEY,
        {
            expiresIn: "30d"
        },
    )
}


export const User = model("User", UserSchema)