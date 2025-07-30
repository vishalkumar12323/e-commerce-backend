import { connectRabbitMQ, closeRabbitMQ } from "./rabbitmq.js";
import { startConsumer } from "./consumer.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    console.log("Successfully connected to RabbitMQ");

    await startConsumer();

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
