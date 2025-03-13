import { generateToken } from "../libs/utils.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      console.log(newUser);

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup Error: ", error);
    res
      .status(500)
      .json({ message: "Internal server error While registering new user" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email or Password is missin" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password is not matched!" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Signin Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Internal server Error while logging out" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const { profilePic } = req.body;
    //
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profile picture is required" });
    }
    //ส่งรูปไฟล์
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    if (!uploadResponse) {
      res
        .status(500)
        .json({ message: "Error while uploading profile picture" });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res
        .status(500)
        .json({ message: "Error while updating profile picture" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Internal server error While updating profile picture",
      });
  }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    }catch (error) {
     res.status(500).json({ message: "Internal Server Error While checking Auth" });
    }
};
