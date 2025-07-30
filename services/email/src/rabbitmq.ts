import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({ quiet: true });

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";
const username = process.env.RABBITMQ_USERNAME || "vishal";
const password = process.env.RABBITMQ_PASSWORD || "login";
const host = process.env.RABBITMQ_HOST || "rabbitmq";
const port = process.env.RABBITMQ_PORT || "5672";

export const connectRabbitMQ = async () => {
  try {
    console.log("env host: ", process.env.RABBITMQ_HOST);
    const url = `amqp://${username}:${password}@${host}:${port}`;

    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue(queue);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error: ", err);
    });

    connection.on("close", () => {
      console.log("RabbitMQ connection closed");
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const closeRabbitMQ = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const getChannel = () => channel;
