# LITIUM

**Live Deployment:** [**https://litium-book-app.vercel.app**](https://litium-book-app.vercel.app)

LITIUM is a full-stack book review and recommendation platform built from scratch. It provides a personalized experience for users to discover, rate, and track their reading, powered by a custom backend, a PostgreSQL database, and the Google Books API.

## Core Features

* **Full User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
* **Genre-Based Registration:** Users can select their favorite genres during signup.
* **Personalized Homepage:**
    * **Recommendations:** The homepage displays a "Based on your love for..." section with books fetched based on a user's favorite genres.
    * **Review History:** Logged-in users can see a gallery of all the books they have previously reviewed.
* **Book Search:** A powerful search page that queries the Google Books API in real-time.
* **Dynamic Book Pages:** Every book has a detailed page showing its cover, author, description, and average rating.
* **Review & Rating System:** Logged-in users can write detailed reviews and leave a 1-5 star rating for any book.

## Tech Stack

This project is a full-stack monorepo with a separate frontend and backend.

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, Next.js, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (hosted on Neon) |
| **APIs & Auth** | Google Books API, JWT (jsonwebtoken), bcrypt |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## How It Works

The application is split into two main parts that work together:

1.  **`frontend` (Next.js):** The client-side application. It handles all UI, user registration/login, and client-side searches. It calls the Google Books API directly for search results and calls our own backend for user data and reviews.

2.  **`backend` (Node.js/Express):** The server-side API. It connects to the PostgreSQL database to manage all user data, reviews, and ratings. It also handles the server-to-server request to the Google Books API to generate personalized recommendations for the homepage.

## Setup & Run Locally

To run this project on your local machine, follow these steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* A free PostgreSQL database (e.g., from [Neon](https://neon.tech/))
* A Google Books API Key

### 1. Setup the Database

1.  Create a new project on Neon and get your **Database Connection String**.
2.  In the Neon SQL Editor, run the following SQL commands to create your tables:

    ```sql
    -- Create the Users table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        favorite_genres TEXT[]
    );

    -- Create the Reviews table
    CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create the Ratings table
    CREATE TABLE ratings (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id)
    );
    ```

### 2. Configure the Backend

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create an environment file:
    ```bash
    touch .env
    ```
4.  Add your secret keys to the `.env` file:
    ```
    DATABASE_URL="YOUR_NEON_CONNECTION_STRING"
    JWT_SECRET="YOUR_RANDOM_SECRET_STRING_FOR_TOKENS"
    GOOGLE_BOOKS_API_KEY="YOUR_GOOGLE_BOOKS_API_KEY"
    CORS_ORIGIN_URL="http://localhost:3000"
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running at `http://localhost:3001`.

### 3. Configure the Frontend

1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a local environment file:
    ```bash
    touch .env.local
    ```
4.  Add your keys to the `.env.local` file:
    ```
    NEXT_PUBLIC_API_URL="http://localhost:3001"
    NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY="YOUR_GOOGLE_BOOKS_API_KEY"
    ```
5.  Start the frontend server:
    ```bash
    npm run dev
    ```
    The app will be running at `http://localhost:3000`.

You can now open the app in your browser and test all features locally.
