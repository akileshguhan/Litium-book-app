"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

// This is a new component for a single book card
function BookReviewCard({ bookId, review, rating }) {
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    // This fetches the book's details (like cover) from Google
    const fetchBookData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        const res = await axios.get(url, { headers: { 'Authorization': null } });
        setBookData(res.data.volumeInfo);
      } catch (err) {
        console.error("Failed to fetch book data for card", err);
      }
    };

    fetchBookData();
  }, [bookId]);

  if (!bookData) {
    return (
      <div className="bg-zinc-800 p-4 rounded-lg shadow-lg h-60 flex items-center justify-center">
        <p className="text-gray-400">Loading book...</p>
      </div>
    );
  }

  return (
    <Link href={`/book/${bookId}`}>
      <div className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:ring-1 hover:ring-blue-500 transition-all duration-300 h-full flex flex-col">
        <div className="relative w-full h-64 mb-4">
          <Image
            src={bookData.imageLinks?.thumbnail || '/placeholder-image.jpg'}
            alt={bookData.title}
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{bookData.title}</h3>
        {rating && (
          <div className="flex items-center space-x-1 mb-2">
            <FaStar color="#ffc107" />
            <span className="text-gray-300">{rating} stars</span>
          </div>
        )}
        <p className="text-sm text-gray-400 line-clamp-2 italic">
          "{review}"
        </p>
      </div>
    </Link>
  );
}

// This is the main component that fetches the user's review list
export default function UserReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch user reviews", err);
      }
      setLoading(false);
    };

    fetchUserReviews();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading your reviews...</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-400">
        You haven't reviewed any books yet. Use the 'Search' link to find some!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {reviews.map((review) => (
        <BookReviewCard 
          key={review.book_id} 
          bookId={review.book_id} 
          review={review.review_text} 
          rating={review.rating} 
        />
      ))}
    </div>
  );
}