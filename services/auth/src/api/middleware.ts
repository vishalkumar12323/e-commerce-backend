import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token-service.js";
import { Request, Response, NextFunction } from "express";
import pkg from "jsonwebtoken";
import { TTokenPayload } from "../types/index.js";

const { TokenExpiredError } = pkg;

declare global {
  namespace Express {
    interface Request {
      user?: TTokenPayload;
      refreshToken?: string;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  try {
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    const payload = verifyAccessToken(accessToken) as TTokenPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(403).json({ message: "Forbidden" });
  }
};

export const isRefreshTokenValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.headers["refresh-token"];
  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  try {
    const payload = verifyRefreshToken(refreshToken) as TTokenPayload;
    req.user = payload;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(403).json({ message: "Forbidden" });
  }
};
