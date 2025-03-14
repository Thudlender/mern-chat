import express from "express";
const router = express.Router();
import { getUsersForSidebar, sendMessage, getMessage } from "../controllers/message.controller";
import { protectedRoute } from "../middleware/auth.middleware";

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/send/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, sendMessage);

export default router;
