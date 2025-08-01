import dotenv from "dotenv";
import amqp from "amqplib";
import { constantVariable } from "./constant.js";

dotenv.config({ quiet: true });

let channel: amqp.Channel;
const username = process.env.RABBITMQ_USERNAME || "user";
const password = process.env.RABBITMQ_PASSWORD || "password";
const host = process.env.RABBITMQ_HOST || "localhost";
const port = process.env.RABBITMQ_PORT || "5672";

export const connectRabbitMQ = async () => {
  try {
    const url = `amqp://${username}:${password}@${host}:${port}`;

    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertExchange(constantVariable.exchangeName, "direct");

    console.log("Successfully connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const publishToQueue = async (pattern: string, data: any) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    const isSent = channel.publish(
      constantVariable.exchangeName,
      pattern,
      Buffer.from(JSON.stringify(data))
    );
    return isSent;
  } catch (error) {
    console.error("Error publishing to queue:", error);
    throw error;
  }
};

export const getChannel = () => channel;
