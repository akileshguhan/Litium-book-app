const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// --- POST /api/auth/register ---
// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
  try {
    // 1. Destructure all new fields from req.body
    const { username, email, password, genres } = req.body;

    // 2. Check for required fields
    if (!username || !email || !password || !genres || genres.length === 0) {
      return res.status(400).json({ message: "Please provide username, email, password, and at least one genre." });
    }

    // 3. Check if user already exists
    const userExists = await db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User with that email or username already exists" });
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 5. Save new user to database (with genres)
    const newUser = await db.query(
      "INSERT INTO users (username, email, password_hash, favorite_genres) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
      [username, email, password_hash, genres]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
  try {
    // CORRECTED LINE: Removed the '_'
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Validate password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create and send JWT token
    const payload = {
      user: {
        id: user.rows[0].id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;