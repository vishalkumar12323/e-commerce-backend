import { connectRabbitMQ, closeRabbitMQ } from "./rabbitmq.js";
import {
  welcomeMailMsgConsumer,
  resetPasswordServiceMsgConsumer,
} from "./consumer.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    console.log("Successfully connected to RabbitMQ");

    await welcomeMailMsgConsumer();
    await resetPasswordServiceMsgConsumer();

    process.on("SIGTERM", async () => {
      try {
        await closeRabbitMQ();
      } catch (error) {
        console.error("Error during closing rabbitmq:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("::", error);
    process.exit(1);
  }
};
startServer();
