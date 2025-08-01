import { connectRabbitMQ, closeRabbitMQ } from "./rabbitmq.js";
import {
  welcomeMailServiceMsgConsumer,
  resetPasswordServiceMsgConsumer,
} from "./consumer.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    console.log("Successfully connected to RabbitMQ");

    await welcomeMailServiceMsgConsumer();
    await resetPasswordServiceMsgConsumer();

    process.on("SIGTERM", async () => {
      try {
        await closeRabbitMQ();
        process.exit(0);
      } catch (error) {
        console.error("Error during closing rabbitmq:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("rabbitmq server starting err:: ", error);
    process.exit(1);
  }
};
startServer();
