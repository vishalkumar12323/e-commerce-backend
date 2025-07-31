import { getChannel } from "./rabbitmq.js";
import { sendWelcomeEmail } from "./controller/sendWelcomeEmail.js";
import { sendPasswordResetEmail } from "./controller/sendPasswordResetEmail.js";

const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";
export const welcomeMailMsgConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange("", "direct", { durable: true });
    await channel.assertQueue(queue);
    await channel.bindQueue(queue, "", "");

    channel.consume(queue, async (message) => {
      if (message) {
        const data = JSON.parse(message.content.toString());
        const { name, email } = data;
        await sendWelcomeEmail({ name, email });
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("error consuming messages: ", error);
  }
};

export const resetPasswordServiceMsgConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange("", "direct");
    await channel.assertQueue("");
    await channel.bindQueue("", "", "");

    channel.consume("", async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        const { token, name, email } = data;
        await sendPasswordResetEmail({ token, name, email });
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log("error consuming messages: ", error);
  }
};
