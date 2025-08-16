const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all questions
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

// Add new question and notify other users
router.post("/", async (req, res) => {
  const { user_id, question, description } = req.body;
  try {
    // 1️⃣ Insert the question
    const result = await pool.query(
      "INSERT INTO user_questions (user_id, title, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [user_id, question, description]
    );
    const newQuestion = result.rows[0];

    // 2️⃣ Get the username of the person who posted
    const userRes = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [user_id]
    );
    const username = userRes.rows[0]?.username || "Someone";

    // 3️⃣ Get all other users to notify
    const usersRes = await pool.query(
      "SELECT id FROM users WHERE id != $1",
      [user_id]
    );
    const otherUserIds = usersRes.rows.map(u => u.id);

    // 4️⃣ Insert notifications for all other users
    for (const uid of otherUserIds) {
      await pool.query(
        `INSERT INTO notifications (user_id, message, type, read, created_at)
         VALUES ($1, $2, 'question', false, NOW())`,
        [uid, `${username} posted a new question: "${question.slice(0, 50)}..."`]
      );
    }

    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
