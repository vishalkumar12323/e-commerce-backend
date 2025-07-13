import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./api/index.js";

dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Authentication api is live 🔴" });
});

const server = app.listen(port, () =>
  console.log(`auth service api running on http://localhost:${port}`)
);

process.on("SIGINT", () => {
  server.close((err) => {
    if (err) console.log("server closing err: ", err);
  });
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) console.log("server closing err: ", err);
  });
});
// 985045
