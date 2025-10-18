const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios'); // <-- MAKE SURE TO ADD THIS

const router = express.Router();

// --- GET /api/user/me/reviews ---
// Gets all reviews and ratings for the logged-in user
router.get('/me/reviews', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        r.book_id, 
        r.review_text, 
        r.created_at, 
        rt.rating 
      FROM reviews r
      LEFT JOIN ratings rt ON r.user_id = rt.user_id AND r.book_id = rt.book_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `;
    
    const { rows } = await db.query(query, [user_id]);
    res.json(rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// --- NEW RECOMMENDATION ENDPOINT ---
// --- GET /api/user/me/recommendations ---
router.get('/me/recommendations', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get user's genres from our DB
    const user = await db.query("SELECT favorite_genres FROM users WHERE id = $1", [user_id]);
    const genres = user.rows[0]?.favorite_genres;

    if (!genres || genres.length === 0) {
      return res.json([]); // Send empty array if user has no genres
    }

    // 2. Pick a random genre from their list
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    // 3. Fetch books from Google Books API using a "subject" query
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY; // Note: We need to add this to .env
    if (!apiKey) {
      console.error("Missing GOOGLE_BOOKS_API_KEY on backend");
      return res.status(500).send("Server configuration error");
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${randomGenre}&key=${apiKey}&maxResults=8&printType=books&orderBy=relevance`;
    
    const { data } = await axios.get(url);
    
    // 4. Send book items and the genre name to the frontend
    res.json({
      genre: randomGenre,
      items: data.items || []
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;