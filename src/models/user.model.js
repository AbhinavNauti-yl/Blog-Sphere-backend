import { Schema, model } from "mongoose";

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
    
    this.password = bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password)
}

export const User = model("User", UserSchema)