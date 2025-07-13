import express from "express";
import AuthService from "../auth-service/index.js";
import { isAuthenticated } from "./middleware.js";

const router = express.Router();
const authService = new AuthService();

router.route("/profile").get(isAuthenticated, async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.route("/signup").post(async (req, res) => {});

router.route("/signin").post(async (req, res) => {});

router.route("/refresh-session").post(async (req, res) => {});

router.route("/logout").delete(async (req, res) => {});

export default router;
