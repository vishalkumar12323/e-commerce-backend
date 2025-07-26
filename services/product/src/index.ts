import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ quiet: true });
const port = process.env.PORT || 3002;

const server = app.listen(port, () =>
  console.log(`product api running on http://localhost:${port}`)
);

process.on("SIGINT", () => {
  server.close((err) => {
    if (err) {
      console.log("server closing err: ", err);
      process.exit(1);
    }
    console.log("product-api closed successfully.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.log("server closing err: ", err);
      process.exit(1);
    }
    console.log("product-api closed successfully.");
    process.exit(0);
  });
});
