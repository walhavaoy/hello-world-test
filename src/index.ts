import express from "express";
import path from "node:path";
import pino from "pino";

const logger = pino({ name: "tmpclaw" });

const app = express();

const port = parseInt(process.env.PORT ?? "3000", 10);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

const greetings: string[] = [
  "Hello!",
  "Hi there!",
  "Hey!",
  "Greetings!",
  "Welcome!",
  "Good day!",
  "Howdy!",
  "What's up!",
];

app.get("/api/greeting", (_req, res) => {
  const index = Math.floor(Math.random() * greetings.length);
  res.json({ greeting: greetings[index] });
});

app.listen(port, () => {
  logger.info({ port }, "server listening");
});
