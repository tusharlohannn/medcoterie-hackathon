const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { full_name, username, email, password } = req.body;
  // username = username.toLowerCase();

  try {
    const userResult = await pool.query(
      "INSERT INTO users (full_name, username) VALUES ($1, $2) RETURNING *",
      [full_name, username]
    );

    const user = userResult.rows[0];

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO login_details (user_id, email, password_hash) VALUES ($1, $2, $3)",
      [user.id, email, hash]
    );

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT ld.user_id, ld.password_hash, u.username, u.full_name 
       FROM login_details ld 
       JOIN users u ON ld.user_id = u.id 
       WHERE ld.email=$1`,
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });

    const userLogin = result.rows[0];

    const isMatch = await bcrypt.compare(password, userLogin.password_hash);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: userLogin.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: userLogin.user_id,
        username: userLogin.username,
        full_name: userLogin.full_name,
        email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
