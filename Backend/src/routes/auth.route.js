import express from "express";
const router = express.Router();
import { signup } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile)

export default router;

