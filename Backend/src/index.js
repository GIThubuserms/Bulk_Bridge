import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import DBconnection from "./db/connection.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json("Helloworld");
});

DBconnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  });
