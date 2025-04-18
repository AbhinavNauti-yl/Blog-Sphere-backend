import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";



const registerUser = asyncHandeler( async (req, res, next) => {
    const { name, email, password } = req.body;
    const allreadyExist = await User.findOne({ email });

    if (allreadyExist) {
      // return res.json({message: "allready exist"})
      throw new apiError (400, "user allredy exist")
    }

    
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });
    
    const createdUser = await User.findOne(user._id).select("-password")

    if (!createdUser) {
      throw new apiError(400, "could not create user in database")
    }

    res.status(200).json(new apiResponse(
      200,
      createdUser,
    ));
});

const generateAccessAndRefreshToken = async (userId) => {
  if(!userId) {
    throw new Error("no user to genereate token")
  }

  const user = await User.findOne(userId)

  if(!user){
    throw new Error("could not find user")
  }

  const accessToken = await user.genereateAccessToken()
  const refreshToken = await user.genereateRefeshToken()

  user.refreshToken = refreshToken
  await user.save({validateBeforSave: false})

  return {accessToken, refreshToken}
}


const loginUser = asyncHandeler (async (req, res, next) => {
  const {email, password} = req.body

  if(!email || !password) {
    throw new apiError(500, "enter credentials")
  }

  const userOnDb = await User.findOne({email})

  if(!userOnDb) {
    throw new apiError (500, "user not registered")
  }

  if(!(await userOnDb.isPasswordCorrect(password))){
    throw new apiError (500, "incorrect pass or email")
  }

  
  const loggedUser = await User.findOne(userOnDb._id).select("-password -refreshToken")

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(loggedUser._id)

  const option = {
    httpOnly: true,
    secure: true,
    maxAge: 7*24*60*60*1000,
  }

  

  res.status(200)
  .cookie("accessToken", accessToken, option )
  .cookie("refreshToken", refreshToken, option )
  .json(new apiResponse(
    200,
    loggedUser,
    "user loged in",
  ))

})


const logoutUser = asyncHandeler( async (req, res, next) => {
  const user = await User.findById(req.user?._id)
  if(!user) throw new apiError(401, "unauhorized request");

  const response = await user.updateOne({
    $set:{
      refreshToken: null,
    },
  })

  if(!response) throw new apiError(500);

  const option = {
    httpOnly: true,
    secure: true,
  }

  res.status(200)
  .clearCookie("accessToken", option)
  .clearCookie("refreshToken", option)
  .json(new apiResponse(200, {}, "logged out successfully"))
})


const getProfile = asyncHandeler( async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("-password -refreshToken")

  if(!user) throw new apiError(401, "unauthorized accesss");

  res.status(200)
  .json(new apiResponse(200, user, "profile fetched successfully"))
})


const updateProfile = asyncHandeler ( async (req, res, next) => {
  const user = req.user
  if(!user) {
    throw new apiError(501, "unauthorized request")
  }

  let {name, email} = req.user

  const { name: nameFromFrontend, email: emailFromFrontend, password: passwordFromFrontend } = req.body;
  name = nameFromFrontend ? nameFromFrontend : name
  email = emailFromFrontend ? emailFromFrontend : email



  const userToUpdate = await User.findById(user._id).select("-refreshTokn -password")
  userToUpdate.name = name
  userToUpdate.email = email
  if(passwordFromFrontend) {
    userToUpdate.password = passwordFromFrontend
  }
  await userToUpdate.save()

  const updatedUser = await User.findById(userToUpdate._id).select("-refreshToken -password")

  if(!updatedUser) throw new apiError(500, "unable to update");

  res.status(200)
  .json(new apiResponse(
    200,
    updatedUser,
    "updated successfuly"
  ))

})


const deleteProfileAvatar = asyncHandeler(async (req, res, next) => {
  const user = req.user

  const userToUpdate = await User.findById(user._id).select("-refreshToken -password")
  await deleteFromCloudinary(userToUpdate.avatar)
  userToUpdate.avatar = null

  await userToUpdate.save()
  
  const updatedUser = await User.findById(userToUpdate._id).select("-refreshToken -password")

  if(!updatedUser) throw new apiError(500, "unable to update user");

  res.status(200).json(
    new apiResponse(200, updatedUser, "profile updated")
  )
})


export {registerUser, loginUser, logoutUser, getProfile, updateProfile, deleteProfileAvatar};
