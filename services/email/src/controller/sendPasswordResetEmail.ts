import path from "node:path";
import fs from "node:fs";
import ejs from "ejs";
import { fileURLToPath } from "node:url";
import { FROM, transporter } from "../config/mailer.js";

export const sendPasswordResetEmail = async ({
  token,
  name,
  email,
}: {
  token: string;
  name: string;
  email: string;
}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(
    __dirname,
    "../templates",
    "resetPasswordMail.ejs"
  );
  const source = fs.readFileSync(templatePath, "utf8");

  const resetPasswordLink = ``;
  const comipled = ejs.compile(source);
  const html = comipled({ name, resetPasswordLink });

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "For Reset Password",
    html,
  });
};
