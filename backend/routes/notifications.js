const express = require("express");
const pool = require("../db");
const router = express.Router();

// get all notifications for a user
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// mark all notifications as read
router.put("/read/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await pool.query("UPDATE notifications SET read = true WHERE user_id = $1", [user_id]);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
