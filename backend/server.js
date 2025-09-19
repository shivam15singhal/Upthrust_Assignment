// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // SQLite DB

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 🔑 API Keys (from .env file)
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || "";

// POST /run-workflow
app.post("/run-workflow", async (req, res) => {
  const { prompt, action } = req.body;

  if (!prompt || !action) {
    return res.status(400).json({ error: "Missing prompt or action" });
  }

  // Step 1: Mock AI Agent (tweet-like message)
  const ai_response = `Tweet: ${prompt.slice(0, 80)}...`;

  let api_response = "";

  try {
  if (action === "weather") {
      // 🌦 Weather API
      if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_WEATHER_KEY") {
        return res.status(500).json({
          error: "Weather API key missing. Please set WEATHER_API_KEY in your .env file."
        });
      }

      const city = "Delhi"; // can make dynamic later
      const weather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!weather.data || !weather.data.main) {
        api_response = "Weather data unavailable right now.";
      } else {
        const data = weather.data;
        api_response = `Weather in ${city}: ${data.main.temp}°C, ${data.weather[0].description}`;
      }
    }
    
    else if (action === "github") {
      // 💻 GitHub API
      const repos = await axios.get(
        "https://api.github.com/search/repositories?q=javascript&sort=stars&order=desc&per_page=1"
      );
      const top = repos.data.items[0];
      api_response = `Top GitHub repo: ${top.full_name} ⭐${top.stargazers_count}`;
    } 
    
   else if (action === "news") {
      // 📰 GNews API
      if (!GNEWS_API_KEY || GNEWS_API_KEY === "YOUR_GNEWS_KEY") {
        return res.status(500).json({
          error: "News API key missing. Please set GNEWS_API_KEY in your .env file."
        });
      }

      const news = await axios.get(
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in&token=${GNEWS_API_KEY}`
      );

      if (!news.data.articles || news.data.articles.length === 0) {
        api_response = "No news articles available at the moment.";
      } else {
        const article = news.data.articles[0];
        api_response = `News: ${article.title} (${article.source.name})`;
      }
    }

    else {
      api_response = "Unknown action";
    }

    // Step 3: Combine results
    const final_result = `${ai_response} ${api_response} #${action}`;

    // Step 4: Save workflow run into DB
    db.run(
      `INSERT INTO history (prompt, action, ai_response, api_response, final_result)
       VALUES (?, ?, ?, ?, ?)`,
      [prompt, action, ai_response, api_response, final_result],
      (err) => {
        if (err) {
          console.error("❌ DB insert error:", err.message);
        } else {
          console.log("✅ Workflow saved to DB");
        }
      }
    );

    res.json({ ai_response, api_response, final_result });

  } catch (err) {
    console.error("API Error:", err.response ? err.response.data : err.message);
    res.status(500).json({
      error: "Failed to fetch external API",
      details: err.response ? err.response.data : err.message,
    });
  }
});

// GET /history → Last 10 workflow runs
app.get("/history", (req, res) => {
  db.all(
    `SELECT * FROM history ORDER BY created_at DESC LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch history" });
      } else {
        res.json(rows);
      }
    }
  );
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
