import { Response, Request, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("error:: ", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};
