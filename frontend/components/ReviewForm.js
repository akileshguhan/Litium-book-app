"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

export default function ReviewForm({ bookId, onReviewSubmitted }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      toast.error('Please provide both a rating and a review.');
      return;
    }
    setLoading(true);

    try {
      // 1. Post the rating
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}/rating`, { rating });

      // 2. Post the review
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}/review`, { review_text: reviewText });

      toast.success('Review submitted successfully!');
      setReviewText('');
      setRating(0);
      onReviewSubmitted(); // This function will refresh the review list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <p className="text-center text-lg p-4 bg-zinc-800 rounded-lg">
        Please <a href="/login" className="text-blue-400 hover:underline">log in</a> to leave a review.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-zinc-800 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Your Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Your Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          rows="4"
          className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What did you think of the book?"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-gray-500"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}