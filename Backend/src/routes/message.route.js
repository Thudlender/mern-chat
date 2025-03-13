import express from "express";
const router = express.Router();
import { getUsersForSidebar } from "../controllers/message.controller";
import { protectedRoute } from "../middleware/auth.middleware";

router.get("/users", protectedRoute, getUsersForSidebar);

export default router;
