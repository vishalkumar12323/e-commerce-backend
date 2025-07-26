import { connectRabbitMQ, closeRabbitMQ } from "./rabbitmq.js"

const startServer = async () => {
  try {
    await connectRabbitMQ();
    console.log("Successfully connected to RabbitMQ");
    process.on("SIGTERM", async () => {
      try {
        await closeRabbitMQ();
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
