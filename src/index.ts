import express from "express";
import path from "path";
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

app.get("/", (_req, res) => {
  const serverTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  res.type("html").send(`<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>tmpclaw</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #1a1614;
      --surface: #242020;
      --border: #3d3634;
      --text: #f0ebe6;
      --text-dim: #9a8f86;
      --accent: #c87070;
      --accent-hover: #d98585;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      max-width: 40rem;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    ::selection { background: var(--accent); color: var(--bg); }
    a { color: var(--accent); text-decoration: none; }
    a:hover { color: var(--accent-hover); }
    h1 { color: var(--text); margin-bottom: 0.5rem; font-size: 1.75rem; }
    #time-display { font-size: 1.125rem; margin-bottom: 1.5rem; color: var(--text-dim); }
    button {
      background: var(--accent);
      color: var(--bg);
      border: none;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: background 0.15s;
    }
    button:hover { background: var(--accent-hover); }
    #greeting-output { margin-top: 1rem; font-size: 1.25rem; min-height: 1.5rem; }

  </style>
</head>
<body>
  <h1 data-testid="heading">tmpclaw</h1>
  <div data-testid="time" id="time-display">${serverTime}</div>
  <button data-testid="greeting-btn" data-action="fetch-greeting">Get Greeting</button>
  <div data-testid="greeting-output" id="greeting-output"></div>

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
