import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
  senderId: { type: String, require: true },
  resiverId: { type: String, require: true },
  text: { type: String },
  image: { type: String },
});

const MessageModel = mongoose.model("message", MessageSchema);
export default MessageModel;
