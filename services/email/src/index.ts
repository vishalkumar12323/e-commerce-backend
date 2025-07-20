import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ quiet: true });

const port = process.env.PORT || 3003;
app.listen(port, () =>
  console.log(`mail service api running http://localhost:${port}`)
);
