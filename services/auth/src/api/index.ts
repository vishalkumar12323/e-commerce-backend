import dotenv from "dotenv";
import express from "express";
import useragnet from "useragent";
import AuthService from "../auth-service/index.js";
import { isAuthenticated, isRefreshTokenValid } from "./middleware.js";
import { TUserProps, TUserCredentials, TTokenPayload } from "../types/index.js";
import { publishToQueue } from "../queue-service/rabbitmq.js";
import { constantVariable } from "../queue-service/constant.js";

dotenv.config({ quiet: true });

const router = express.Router();
const authService = new AuthService();

router.route("/users").get(async (req, res) => {
  try {
    const users = await authService.users();
    res.status(200).json(users);
  } catch (error) {
    console.log("error getting users: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.route("/profile").get(isAuthenticated, async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user?.id as string);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user profile:", error);
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
    const isEmailSent = await publishToQueue(constantVariable.WMQPattern, {
      name,
      email,
    });

    console.log("isEmailSent: ", isEmailSent);
    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.log("signup error: ", error);
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
    console.log("signin error: ", error);
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(409).json({ message: "Invalid email or password" });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.route("/refresh-session").post(isRefreshTokenValid, async (req, res) => {
  const { refreshToken } = req;

  try {
    const newAccessToken = await authService.refreshSession(
      req.user as TTokenPayload,
      refreshToken as string
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log("refresh-token error: ", error);
    if (error instanceof Error && error.message === "INVALID_SESSION") {
      return res
        .status(401)
        .json({ message: "invalid session or session expired" });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.route("/logout").delete(async (req, res) => {
  const refreshToken = req.headers["refresh-token"];
  if (!refreshToken || typeof refreshToken !== "string")
    return res.status(401).json({ message: "Refresh token is required." });

  try {
    await authService.logout(refreshToken);
    res.status(200).json({ message: "Logged out from current session" });
  } catch (error) {
    console.log("logout error: ", error);
    if (error instanceof Error && error.message) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.route("/change-password").patch(isAuthenticated, async (req, res) => {
  const {
    oldPassword,
    newPassword,
  }: { oldPassword: string; newPassword: string } = req.body;
  const userEmail = req.user?.email;

  try {
    await authService.changePassword(
      userEmail as string,
      oldPassword,
      newPassword
    );

    res.status(200).json({ message: "password updated successfully." });
  } catch (error) {
    if (error instanceof Error && error.message) {
      res.status(404).json(error.message);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.route("/forgot-password").post(async (req, res) => {
  const { email }: { email: string } = req.body;
  try {
    const { token, userEmail, name } = await authService.forgotPassword(email);

    const isMailSent = await publishToQueue(constantVariable.RPMQPattern, {
      token,
      userEmail,
      name,
    });
    console.log("isMailSent: ", isMailSent);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
