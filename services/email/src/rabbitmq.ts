import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({ quiet: true });

let channel: amqp.Channel;
let connection: amqp.ChannelModel;

const username = process.env.RABBITMQ_USERNAME || "vishal";
const password = process.env.RABBITMQ_PASSWORD || "login";
const host = process.env.RABBITMQ_HOST || "rabbitmq";
const port = process.env.RABBITMQ_PORT || "5672";

export const connectRabbitMQ = async () => {
  try {
    const url = `amqp://${username}:${password}@${host}:${port}`;

    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue("WELCOME_MAIL_QUEUE");
    await channel.assertQueue("RESET_PASSWORD_MAIL_QUEUE");

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
