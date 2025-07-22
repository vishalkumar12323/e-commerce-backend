import {connectRabbitMQ, getChannel} from "./rabbitmq.js";
import {sendWelcomeEmail} from "./controller/sendWelcomeEmail.js"

const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";
const startConsumer = async () => {
  await connectRabbitMQ();
  const channel = getChannel();

  channel.consume(queue, async(message) => {
    if(message) {
      const data = JSON.parse(message.content.toString());
      const {name, email} = data;
      await sendWelcomeEmail({name, email});
      channel.ack(message);
    }
  });
}

startConsumer();