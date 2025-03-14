import express from "express";
import {
    addFriend,
    acceptFriendRequest,
} from "../controllers/friend.controller";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router
