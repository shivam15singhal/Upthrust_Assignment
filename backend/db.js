// db.js
const sqlite3 = require("sqlite3").verbose();

// Create or open database file
const db = new sqlite3.Database("./workflow.db", (err) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Create table if it doesn’t exist
db.run(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT,
    action TEXT,
    ai_response TEXT,
    api_response TEXT,
    final_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
