import dotenv from "dotenv";
import express from "express";
import { connectRabbitMQ, closeRabbitMQ} from "./rabbitmq.js";

dotenv.config({ quiet: true });
const app = express();

const port = process.env.PORT || 3003;

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error: ", err);
    res.status(500).json({ err: err.message || "Internal server error" });
  }
);

const startServer = async () => {
  try {
    const server = app.listen(port, async () => {
      console.log(`mail service api running http://localhost:${port}`);
      await connectRabbitMQ();
      console.log("Successfully connected to RabbitMQ");
    });
    process.on("SIGTERM", async () => {
      try {
        await closeRabbitMQ();
        server.close((err) => {
          if (err) {
            console.error("Error closing server:", err);
            process.exit(1);
          }
          console.log("Server closed successfully");
          process.exit(0);
        });
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
