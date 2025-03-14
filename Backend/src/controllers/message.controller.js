import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await UserModel.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong Server error while getting users for sidebar" })
    }
};

export const sendMessage = async (req, res) =>{
    try {
      const { id: receiverId } = req.params;
      if(!id) {
        return res.status(400).json({ message: "Receiver ID is required" });
      }
      const senderId = req.user._id;

      let imageURL;
      const {text, image} = req.body;
      if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageURL = uploadResponse.secure_url;
      }

      const newMessage = await new Message.find({
        senderId,
        receiverId,
        text,
        image:imageURL
      });
      await newMessage.save();
      const getReceiverSocketId = getReceiverSocketId(receiverId);
      if (getReceiverSocketId) {
        io.to(receiverSocketId).emit("newMassage", newMessage);
      }
      res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "internal Server Error While sending message"});
    }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await MessageModel.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal Server Error While sending message" });
  }
};

