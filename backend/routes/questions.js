const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT q.*, u.username
      FROM user_questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  const { user_id, question, description } = req.body; // changed title -> question
  try {
    const result = await pool.query(
      "INSERT INTO user_questions (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, question, description]  // use question as title
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
