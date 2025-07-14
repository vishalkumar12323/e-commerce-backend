import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { TTokenPayload } from "../types/index.js";

dotenv.config({ quiet: true });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const createAccessToken = (payload: TTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "5d",
  });
};

const createRefreshToken = (payload: TTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "10d",
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export { createAccessToken, createRefreshToken, verifyAccessToken };
