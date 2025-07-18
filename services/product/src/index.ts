import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ quiet: true });
const port = process.env.PORT || 3002;

app.listen(port, () =>
  console.log(`product api running on http://localhost:${port}`)
);
