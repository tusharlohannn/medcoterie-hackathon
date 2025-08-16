const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all answers for a question with user info
router.get("/:question_id", async (req, res) => {
  const { question_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.id, a.description, a.created_at, u.username, u.full_name
       FROM answers a
       JOIN users u ON a.user_id = u.id
       WHERE a.question_id = $1
       ORDER BY a.created_at ASC`,
      [question_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED: just "/" instead of "/answers"
router.post("/", async (req, res) => {
  try {
    const { user_id, question_id, description } = req.body;

    // 1️⃣ Insert the answer
    const result = await pool.query(
      `INSERT INTO answers (user_id, question_id, description, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, description, created_at,
                 (SELECT username FROM users WHERE id = $1) AS username`,
      [user_id, question_id, description]
    );

    const newAnswer = result.rows[0];

    // 2️⃣ Get the question owner
    const questionRes = await pool.query(
      `SELECT user_id FROM user_questions WHERE id = $1`,
      [question_id]
    );

    const questionOwnerId = questionRes.rows[0]?.user_id;

    // 3️⃣ Insert notification if the answer is from someone else
    if (questionOwnerId && questionOwnerId !== user_id) {
      await pool.query(
        `INSERT INTO notifications (user_id, message, type, read, created_at)
   VALUES ($1, $2, $3, false, NOW())`,
        [
          questionOwnerId,
          `${newAnswer.username} answered your question: "${newAnswer.description.slice(0, 50)}..."`,
          'answer'  // <--- type of notification
        ]
      );

    }

    res.json(newAnswer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
