import express from "express";
import useragnet from "useragent";
import AuthService from "../auth-service/index.js";
import { isAuthenticated } from "./middleware.js";
import { TUserProps, TUserCredentials } from "../types/index.js";

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

router.route("/signup").post(async (req, res) => {
  const { name, email, phone_number, password }: TUserProps = req.body;

  const ip_address = req.ip as string;
  const user_agent = useragnet
    .parse(req.headers["user-agent"] || "")
    .toString();
  try {
    const { user, accessToken, refreshToken } = await authService.signup(
      {
        name,
        email,
        password,
        phone_number,
      },
      { ip_address, user_agent }
    );

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return res.status(409).json({ message: "USER_ALREADY_EXISTS" });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.route("/signin").post(async (req, res) => {
  const { email, password }: TUserCredentials = req.body;
  const ip_address = req.ip as string;
  const user_agent = useragnet
    .parse(req.headers["user-agent"] || "")
    .toString();
  try {
    const { user, accessToken, refreshToken } = await authService.signin(
      {
        email,
        password,
      },
      { ip_address, user_agent }
    );

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(409).json({ message: "Invalid email or password" });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.route("/refresh-session").post(async (req, res) => {});

router.route("/logout").delete(async (req, res) => {});

export default router;
