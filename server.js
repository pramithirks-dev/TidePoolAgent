/**
 * Marina — TidePool Donor Impact Intelligence Agent
 * Backend proxy server — fixes CORS and handles Anthropic API calls
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Allow requests from GitHub Pages and any localhost port
app.use(
  cors({
    origin: [
      "https://pramithirks-dev.github.io",
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(:\d+)?$/,
    ],
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

// Serve the static frontend
app.use(express.static(path.join(__dirname, "docs")));

// ─── Chat proxy endpoint ──────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  // Accept API key from env var (server mode) OR Authorization header (browser-pass-through mode)
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({
      error:
        "No API key. Set ANTHROPIC_API_KEY env var on the server, or pass it as Authorization: Bearer <key>",
    });
  }

  const { messages, system, model, max_tokens } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1200,
        system: system || "",
        messages,
      }),
    });

    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch (err) {
    console.error("Anthropic proxy error:", err.message);
    res.status(500).json({ error: "Proxy error: " + err.message });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agent: "Marina v1.0",
    model: "claude-sonnet-4-6",
    key_mode: process.env.ANTHROPIC_API_KEY ? "server" : "browser-passthrough",
  });
});

// Serve frontend for all other routes
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Marina proxy server running on port ${PORT}`);
  console.log(
    `API key mode: ${process.env.ANTHROPIC_API_KEY ? "server (env var)" : "browser-passthrough"}`
  );
});
