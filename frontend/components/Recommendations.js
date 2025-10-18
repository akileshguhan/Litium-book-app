"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// A simple sub-component for displaying a book card
function BookCard({ book }) {
  const bookId = book.id;
  const title = book.volumeInfo.title;
  const cover = book.volumeInfo.imageLinks?.thumbnail || '/placeholder-image.jpg';
  const author = book.volumeInfo.authors?.join(', ') || 'Unknown Author';

  return (
    <Link href={`/book/${bookId}`}>
      <div className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:ring-1 hover:ring-blue-500 transition-all duration-300 h-full flex flex-col">
        <div className="relative w-full h-64 mb-4">
          <Image
            src={cover}
            alt={title}
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-400 line-clamp-1">{author}</p>
      </div>
    </Link>
  );
}

// The main component to fetch and display recommendations
export default function Recommendations() {
  const [data, setData] = useState(null); // Will store { genre, items }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me/recommendations`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading recommendations...</p>;
  }

  // Handle cases where user has no genres or no books were found
  if (!data || !data.items || data.items.length === 0) {
    return (
      <p className="text-center text-gray-400">
        Review some books or update your profile to see recommendations.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Based on your love for <span className="capitalize text-blue-400">{data.genre}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}