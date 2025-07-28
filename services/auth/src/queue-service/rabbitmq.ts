import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({ quiet: true });

let channel: amqp.Channel;
const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";
const username = process.env.RABBITMQ_USERNAME || "user";
const password = process.env.RABBITMQ_PASSWORD || "password";
const host = process.env.RABBITMQ_HOST || "localhost";
const port = process.env.RABBITMQ_PORT || "5672";

const exchage = process.env.RABBITMQ_EXCHAGE || "mail_exchange";
const routingKey =
  process.env.RABBITMQ_ROUTING_KEY ||
  "b23077aa2ddd88c9ef402a2334bd3054cd13acf95ecc9c5f0cd03ad8a0bb";

export const connectRabbitMQ = async () => {
  try {
    const url = `amqp://${username}:${password}@${host}:${port}`;

    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertExchange(exchage, "direct");
    await channel.assertQueue(queue);

    await channel.bindQueue(queue, exchage, routingKey);
    console.log("Successfully connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const publishToQueue = async (queue: string, data: any) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    console.log("data: ", data);
    const isSent = channel.publish(
      exchage,
      routingKey,
      Buffer.from(JSON.stringify(data))
    );
    return isSent;
  } catch (error) {
    console.error("Error publishing to queue:", error);
    throw error;
  }
};

export const getChannel = () => channel;
