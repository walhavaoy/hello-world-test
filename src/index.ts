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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>tmpclaw</title>
  <style>
    :root {
      --surface: #ffffff;
      --bg: #f4f5f7;
      --text: #1a1a1a;
      --text-dim: #666666;
      --border: #dddddd;
      --accent: #0066cc;
      --success: #22863a;
      --btn-bg: #0066cc;
      --btn-text: #ffffff;
      --btn-hover: #0052a3;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: var(--text);
      background: var(--bg);
      min-height: 100vh;
      padding: 1rem;
    }
    .container {
      max-width: 64rem;
      margin: 0 auto;
      padding: 1rem;
      width: 100%;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: var(--text-dim);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .hero-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .hero-card h2 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
      color: var(--text);
    }
    #time-display {
      font-size: 1rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
    }
    button {
      padding: 0.625rem 1.25rem;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: 0.375rem;
      background: var(--btn-bg);
      color: var(--btn-text);
      font-weight: 500;
    }
    button:hover {
      background: var(--btn-hover);
    }
    #greeting-output {
      margin-top: 1rem;
      font-size: 1.25rem;
      min-height: 1.5rem;
      color: var(--accent);
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      gap: 1rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      transition: border-color 0.15s;
    }
    .card:hover {
      border-color: var(--accent);
    }
    .card-title {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--success);
      display: inline-block;
    }
    .card-meta {
      color: var(--text-dim);
      font-size: 0.875rem;
    }
    @media (max-width: 48rem) {
      .container { padding: 0.75rem; }
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 1.5rem; }
      .hero-card { padding: 1rem; }
    }
    @media (max-width: 30rem) {
      .container { padding: 0.5rem; }
      h1 { font-size: 1.25rem; }
      button { font-size: 0.875rem; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 data-testid="heading">tmpclaw</h1>
    <div class="subtitle">Kubernetes-native AI agent platform</div>
    <div class="hero-card">
      <h2>Interactive Greeting</h2>
      <div id="time-display" data-testid="time">${serverTime}</div>
      <button data-testid="greeting-btn">Get Greeting</button>
      <div id="greeting-output" data-testid="greeting-output"></div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="card-title"><span class="status-dot"></span>Health Endpoint</div>
        <div class="card-meta">/healthz &mdash; system health check</div>
      </div>
      <div class="card">
        <div class="card-title"><span class="status-dot"></span>Greeting API</div>
        <div class="card-meta">/api/greeting &mdash; random greeting JSON</div>
      </div>
      <div class="card">
        <div class="card-title"><span class="status-dot"></span>Static Assets</div>
        <div class="card-meta">Served via express.static from /public</div>
      </div>
    </div>
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
