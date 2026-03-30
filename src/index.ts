import express from "express";
import pino from "pino";

const logger = pino({ name: "tmpclaw" });

const app = express();

const port = parseInt(process.env.PORT ?? "3000", 10);

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

app.get("/", (_req, res) => {
  const serverTime = new Date().toISOString();
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hello World</title>
  <style>
    :root {
      --bg: #1a1a2e;
      --text: #e0e0e0;
      --accent: #4a90d9;
      --surface: #16213e;
      --border: #2a2a4a;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 2.5rem;
      max-width: 32rem;
      width: 100%;
      box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.3);
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .time {
      color: var(--text);
      font-size: 0.85rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      font-variant-numeric: tabular-nums;
      opacity: 0.65;
    }
    button {
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 0.375rem;
      padding: 0.625rem 1.25rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.15s;
      width: 100%;
    }
    button:hover { background: #5ba0e9; }
    .greeting {
      min-height: 1.5rem;
      margin-top: 1.25rem;
      color: var(--accent);
      font-size: 1.25rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1 data-testid="heading">Hello World</h1>
    <p class="time" data-testid="time">Server time: ${serverTime}</p>
    <button data-testid="greeting-btn">Get Greeting</button>
    <p class="greeting" data-testid="greeting-output"></p>
  </div>
  <script>
    document.querySelector('[data-testid="greeting-btn"]').addEventListener('click', async function () {
      var output = document.querySelector('[data-testid="greeting-output"]');
      try {
        var resp = await fetch('/api/greeting');
        if (!resp.ok) throw new Error('Request failed');
        var data = await resp.json();
        output.textContent = data.greeting;
      } catch (e) {
        output.textContent = 'Failed to fetch greeting';
      }
    });
  </script>
</body>
</html>`);
});

app.get("/api/greeting", (_req, res) => {
  const index = Math.floor(Math.random() * greetings.length);
  res.json({ greeting: greetings[index] });
});

app.listen(port, () => {
  logger.info({ port }, "server listening");
});
