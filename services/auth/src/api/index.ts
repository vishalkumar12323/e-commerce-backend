import express from "express";
import AuthService from "../auth-service/index";

const router = express.Router();
const authService = new AuthService();

router.route("/profile").get(async (req, res) => {});

router.route("/signup").post(async (req, res) => {});

router.route("/signin").post(async (req, res) => {});

router.route("/refresh-session").post(async (req, res) => {});

router.route("/logou").delete(async (req, res) => {});

export default router;
