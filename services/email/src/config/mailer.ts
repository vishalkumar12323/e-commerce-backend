import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ quiet: true });

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const FROM = `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`;
