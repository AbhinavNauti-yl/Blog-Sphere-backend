import { User } from "../models/user.model.js";



const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const allreadyExist = await User.findOne({ email });

    if (allreadyExist) {
      return res.json({message: "allready exist"})
    }

    
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });
    
    const createdUser = await User.findOne(user._id).select("-password")

    if (!createdUser) {
        return res.json({
        message: "user not created",
      });
      
    }

    const token = await generateTokn(createdUser)

    res.send({
        name: createdUser.name,
        email: createdUser.email,
        token: token
    });

  } catch (error) {
    console.log(error);
  }
};

const generateTokn = async (userId) => {
  if(!userId) {
    throw new Error("no user to genereate token")
  }

  const user = await User.findOne(userId)

  if(!user){
    throw new Error("could not find user")
  }

  return await user.generateJWT(user._id)
}

export default registerUser;
