const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name, username, created_at FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post("/", async (req, res) => {
  const { full_name, username } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (full_name, username) VALUES ($1, $2) RETURNING *",
      [full_name, username]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
