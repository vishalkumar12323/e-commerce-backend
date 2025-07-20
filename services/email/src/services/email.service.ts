import { FROM, transporter } from "../config/mailer.js";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
  });
};
