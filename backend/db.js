const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for services like Neon/Render
  }
});

// Export a query function
module.exports = {
  query: (text, params) => pool.query(text, params),
};