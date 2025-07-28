import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./api/index.js";
import { connectRabbitMQ } from "./queue-service/rabbitmq.js";

dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT || 3001;

connectRabbitMQ().catch((err) => {
  console.log("Failed to initialize RabbitMQ:", err);
  process.exit(1);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Authentication API is live 🔴" });
});

const server = app.listen(port, () =>
  console.log(`auth service api running on http://localhost:${port}`)
);

process.on("SIGINT", () => {
  server.close((err) => {
    if (err) {
      console.log("server closing err: ", err);
      process.exit(1);
    }
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.log("server closing err: ", err);
      process.exit(1);
    }
    console.log("auth-api closed successfully.");
    process.exit(0);
  });
});
