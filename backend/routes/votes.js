const express = require("express");
const router = express.Router();
const pool = require("../db");

// vote on a question or answer
router.post("/", async (req, res) => {
  const { user_id, target_id, target_type, vote_type } = req.body;

  try {
    // 1️⃣ Insert or update the vote
    const voteResult = await pool.query(
      `INSERT INTO votes (user_id, target_id, target_type, vote_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, target_id, target_type)
       DO UPDATE SET vote_type = EXCLUDED.vote_type
       RETURNING *`,
      [user_id, target_id, target_type, vote_type]
    );

    // 2️⃣ Get the owner of the target
    let ownerId;
    if (target_type === "question") {
      const q = await pool.query(
        `SELECT user_id FROM questions WHERE id = $1`,
        [target_id]
      );
      ownerId = q.rows[0]?.user_id;
    } else if (target_type === "answer") {
      const a = await pool.query(
        `SELECT user_id FROM answers WHERE id = $1`,
        [target_id]
      );
      ownerId = a.rows[0]?.user_id;
    }

    // 3️⃣ Create a notification if user is not voting their own post
    if (ownerId && ownerId !== user_id) {
      const action = vote_type === 1 ? "upvoted" : "downvoted";
      await pool.query(
        `INSERT INTO notifications (user_id, message, type, read, created_at)
         VALUES ($1, $2, $3, false, NOW())`,
        [ownerId, `User ${user_id} ${action} your ${target_type}.`, 'vote']
      );
    }

    res.json(voteResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// get vote score for a target
router.get("/:target_type/:target_id", async (req, res) => {
  const { target_type, target_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(vote_type), 0) as score
       FROM votes
       WHERE target_type = $1 AND target_id = $2`,
      [target_type, target_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
