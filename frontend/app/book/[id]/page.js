"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import StarRating from '../../../components/StarRating';
import ReviewForm from '../../../components/ReviewForm';

// Helper component for displaying average rating
function AverageRating({ avgRating, count }) {
  if (count === 0) {
    return <p className="text-gray-400">No ratings yet.</p>;
  }
  return (
    <div className="flex items-center space-x-2">
      <StarRating rating={Math.round(avgRating)} readOnly={true} />
      <span className="text-gray-300">
        ({Number(avgRating).toFixed(1)} out of 5, from {count} ratings)
      </span>
    </div>
  );
}

// Helper component for displaying a single review
function ReviewCard({ review }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">{review.username}</h4>
        <span className="text-sm text-gray-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-300">{review.review_text}</p>
    </div>
  );
}

// Main Page Component
export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id;

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({ average_rating: 0, rating_count: 0 });
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Functions ---

  // Fetches reviews and ratings from OUR backend
  const fetchReviewsAndRatings = useCallback(async () => {
    if (!bookId) return;
    try {
      // Fetch reviews
      const reviewsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}`);
      setReviews(reviewsRes.data);

      // Fetch average rating
      const ratingRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}/rating`);
      setRatingInfo(ratingRes.data);
    } catch (err) {
      console.error("Failed to fetch reviews or ratings", err);
    }
  }, [bookId]);

  // Fetches book details from GOOGLE BOOKS API
  useEffect(() => {
    if (!bookId) return;
    
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        
        // Use the same 'null' header trick to avoid sending auth token to Google
        const res = await axios.get(url, { headers: { 'Authorization': null } });
        
        setBook(res.data.volumeInfo);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      }
      setLoading(false);
    };

    fetchBookDetails();
    fetchReviewsAndRatings();
  }, [bookId, fetchReviewsAndRatings]);

  // --- Render Logic ---

  if (loading) {
    return <div className="text-center mt-20 text-2xl">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center mt-20 text-2xl text-red-500">Book not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Book Info Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <Image
            src={book.imageLinks?.thumbnail || '/placeholder-image.jpg'}
            alt={book.title}
            width={200}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-2xl text-gray-400 mb-4">{book.authors?.join(', ')}</h2>
          <div className="mb-4">
            <AverageRating 
              avgRating={ratingInfo.average_rating} 
              count={ratingInfo.rating_count} 
            />
          </div>
          <div 
            className="text-gray-300 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: book.description }} 
          />
        </div>
      </div>

      {/* Review Form Section */}
      <ReviewForm bookId={bookId} onReviewSubmitted={fetchReviewsAndRatings} />

      {/* Reviews List Section */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Community Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Be the first to leave a review for this book.</p>
        )}
      </div>
    </div>
  );
}