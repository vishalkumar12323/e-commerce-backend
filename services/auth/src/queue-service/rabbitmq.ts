import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({quiet: true});

let channel: amqp.Channel;
const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(queue);
};

export const publishToQueue = async (queue: string, data: any) => {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};

export const getChannel = () => channel;