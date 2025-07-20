import express from "express";
import { sendMail } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send", sendMail);

export default router;
