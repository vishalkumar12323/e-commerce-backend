import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config({quiet: true});

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const queue = process.env.EMAIL_QUEUE || "SEND_MAIL_QUEUE";

export const connectRabbitMQ = async () => {
  try {
     connection = await amqp.connect("amqp://localhost");
     channel = await connection.createChannel();
     await channel.assertQueue(queue);

     connection.on("error", (err) => {
      console.error('RabbitMQ connection error: ', err);
     });

     connection.on('close', () => {
      console.log('RabbitMQ connection closed');
     })
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const closeRabbitMQ = async () => {
  try {
    if(channel) {
      await channel.close();
    }
    if(connection) {
      await connection.close();
    }
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const getChannel = () => channel;
