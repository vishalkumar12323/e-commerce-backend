import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";
import {transporter, FROM} from "../config/mailer.js"

export const sendWelcomeEmail = async ({name, email}: {name: string, email: string}) => {
  const templatePath = path.join(__dirname, 'templates', 'welcome.ejs');
  const source = fs.readFileSync(templatePath, 'utf8');
  const comipled = ejs.compile(source);
  const html = comipled({name});

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Welcome to E-Commerce-World",
    html
  });
};