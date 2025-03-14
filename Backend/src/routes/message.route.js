import express from "express";
const router = express.Router();
import { getUsersForSidebar, sendMessage, getMessage } from "../controllers/message.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import { checkFriendShip } from "../middleware/friend.middleware";

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/send/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, checkFriendShip, sendMessage);

export default router;
