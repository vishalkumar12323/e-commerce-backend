import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("dev"));

app.use(globalErrorHandler);

app.get(
  "/",
  (req, res, next) => {
    console.log(`middleware running [INCOMING REQUEST IP] : [IP: ${req.ip}]`);
    next();
  },
  (req, res) => {
    res.status(200).json({ message: "API running is live 🔴" });
  }
);

export default app;
