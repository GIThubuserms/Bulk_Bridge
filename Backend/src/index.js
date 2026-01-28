import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(4000, (_req, _res) => {
  console.log("App is listening on Port 4000");
});
