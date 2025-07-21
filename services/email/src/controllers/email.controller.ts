import { Request, Response } from "express";
import { sendEmail, } from "../services/email.service.js";

export const sendMail = async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html)
    return res
      .status(400)
      .json({ message: "to, subject, and html are required" });

  try {
    const info = await sendEmail({ to, subject, html });
    res.status(200).json({ message: "Email sent", messageId: info.messageId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
