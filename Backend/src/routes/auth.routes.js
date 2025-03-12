import express from "express";
const router = express.Router();
import { signup } from "../controllers/auth.controller.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", updateProfile)

export default router;

