import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bycrypt from 'bcryptjs'

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password,salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser){
        //Generate JWT
        generateToken(newUser._id, res)
        await newUser.save()
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser?.profilePic,
        })
        console.log(`User created with this Id ${newUser._id} successfully`);
    }else{
        res.status(400).json({error: "Invalid user data"})
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const login = (req, res) => {
  res.send("login controller");
};
export const logout = (req, res) => {
  res.send("logout controller");
};
