import { getChannel } from "./rabbitmq.js";
import { sendWelcomeEmail } from "./controller/sendWelcomeEmail.js";
import { sendPasswordResetEmail } from "./controller/sendPasswordResetEmail.js";
import { constantVariables } from "./constant.js";

export const welcomeMailServiceMsgConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange(constantVariables.exchangeName, "direct", {
      durable: true,
    });
    await channel.assertQueue(constantVariables.welcomeMessageQueue);
    await channel.bindQueue(
      constantVariables.welcomeMessageQueue,
      constantVariables.exchangeName,
      constantVariables.WMQPattern
    );

    channel.consume(constantVariables.welcomeMessageQueue, async (message) => {
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

    await channel.assertExchange(constantVariables.exchangeName, "direct");
    await channel.assertQueue(constantVariables.resetPasswordMessageQueue);
    await channel.bindQueue(
      constantVariables.resetPasswordMessageQueue,
      constantVariables.exchangeName,
      constantVariables.RPMQPattern
    );

    channel.consume(
      constantVariables.resetPasswordMessageQueue,
      async (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());
          const { token, name, email } = data;
          await sendPasswordResetEmail({ token, name, email });
          channel.ack(msg);
        }
      }
    );
  } catch (error) {
    console.log("error consuming messages: ", error);
  }
};
