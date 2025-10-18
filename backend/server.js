require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // We will create this next

const app = express();

// --- Middleware ---
// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN_URL
}));
// Parse JSON bodies
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Book Review API is running!');
});

// Import and use routes (we will create these soon)
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);


// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});