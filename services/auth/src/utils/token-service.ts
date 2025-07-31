import dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { TTokenPayload } from "../types/index.js";

dotenv.config({ quiet: true });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "2m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "5m";
const SESSION_EXPIRY = process.env.SESSION_EXPIRY || "5m";

const createAccessToken = (payload: TTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as SignOptions);
};

const createRefreshToken = (payload: TTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as SignOptions);
};

const generateRandomToken = (payload: any, expiryTime: string): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: expiryTime,
  } as SignOptions);
};
const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

const getSessionExpiryMs = (): number => {
  const minutes = parseInt(SESSION_EXPIRY) || 5;
  return 1000 * 60 * minutes;
};
export {
  createAccessToken,
  createRefreshToken,
  generateRandomToken,
  verifyAccessToken,
  verifyRefreshToken,
  getSessionExpiryMs,
};
