import { verifyAccessToken } from "../utils/token-service.js";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
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
    if (!accessToken) return res.status(401).json({ message: "Unauthorize" });
    const user = verifyAccessToken(accessToken);
    req.user = user;
    next();
  } catch (error) {
    console.log("authentication error ", error);
    res.status(403).json({ message: "Forbidden" });
    return;
  }
};
