import { generateToken } from "../lib/utils";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import cloudinary from "../cloudinary";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already exist" })
    }
    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    })
    if (newUser) {
        generateToken(newUser, res);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })
    } else {
        res.status(400).json({ message: "Invalid user data" })
    }
} catch (error) {
    console.log(error);

        res.status(500).json({ message: "Internal Server Error While registering a new user"})
    }
}

export const login = async
//////////////////////////

export const logout = async;

