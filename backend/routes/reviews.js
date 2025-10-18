const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- GET /api/reviews/:bookId ---
// Get all reviews for a specific book
router.get('/:bookId', async (req, res) => {
  try {
    // CORRECTED LINE: Removed the '_'
    const { bookId } = req.params;
    const reviews = await db.query(
      "SELECT r.id, r.review_text, r.created_at, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.book_id = $1 ORDER BY r.created_at DESC",
      [bookId]
    );
    res.json(reviews.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- GET /api/reviews/:bookId/rating ---
// Get average rating and count for a specific book
router.get('/:bookId/rating', async (req, res) => {
  try {
    // CORRECTED LINE: Removed the '_'
    const { bookId } = req.params;
    const rating = await db.query(
      "SELECT AVG(rating) as average_rating, COUNT(rating) as rating_count FROM ratings WHERE book_id = $1",
      [bookId]
    );
    res.json(rating.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- POST /api/reviews/:bookId/review ---
// Post a new review (Protected Route)
router.post('/:bookId/review', authMiddleware, async (req, res) => {
  try {
    // CORRECTED LINE: Removed the '_'
    const { bookId } = req.params;
    const { review_text } = req.body;
    const user_id = req.user.id; // From authMiddleware

    const newReview = await db.query(
      "INSERT INTO reviews (book_id, user_id, review_text) VALUES ($1, $2, $3) RETURNING *",
      [bookId, user_id, review_text]
    );
    res.status(201).json(newReview.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- POST /api/reviews/:bookId/rating ---
// Post or update a rating (Protected Route)
router.post('/:bookId/rating', authMiddleware, async (req, res) => {
  try {
    // CORRECTED LINE: Removed the '_'
    const { bookId } = req.params;
    const { rating } = req.body;
    const user_id = req.user.id; // From authMiddleware

    // Use "ON CONFLICT" to update the rating if it already exists (upsert)
    const newRating = await db.query(
      `INSERT INTO ratings (book_id, user_id, rating) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET rating = $3
       RETURNING *`,
      [bookId, user_id, rating]
    );

    res.status(201).json(newRating.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;