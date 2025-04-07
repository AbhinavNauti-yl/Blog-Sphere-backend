import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import apiError from './apiError.js'
import { log } from 'console'


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



const uploadToCloudinary = async (localPath) => {

    try {
        if (!localPath) return null;
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: 'image',
            folder: 'BlogSphere'
        })
        fs.unlinkSync(localPath)
        return response.url
        
    } catch (error) {
        fs.unlinkSync(localPath)
        throw new apiError(400, error.message)
    }
}


const deleteFromCloudinary = async (url)=>{
    try {
        if (url == "" || url == null) return null

        const extractPublicId = (url) => {
            // Remove the Cloudinary domain and transformation parts
            const parts = url.split('/').slice(7); // Split by '/' and remove the first 7 segments
          
            // Join remaining parts to form the public ID with the extension
            const publicIdWithExtension = parts.join('/');
          
            // Remove the file extension (.jpg, .png, etc.)
            const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
          
            return publicId;
          };

        const public_id = extractPublicId(url)
        
        const responce = await cloudinary.uploader.destroy(public_id,{
            invalidate: true,
            resource_type: 'image',
        })
        if(!responce){
            console.log("something went wrong while deleting")
        }

        return responce

    } catch (error) {
        console.log(error.message)
        return null
    }
}

export {uploadToCloudinary, deleteFromCloudinary}