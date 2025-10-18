"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    console.log("My API Key:", apiKey);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=20`;

    try {
      const res = await axios.get(url, {
        headers: { 'Authorization': null } 
        });
      setResults(res.data.items || []);
      if (!res.data.items) {
        toast.error('No books found.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch books. Check your API key.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Search for a Book</h1>
      <form onSubmit={handleSearch} className="flex mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="flex-grow px-4 py-2 bg-zinc-700 rounded-l-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-r-md transition duration-200 disabled:bg-gray-500"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((book) => (
          <Link href={`/book/${book.id}`} key={book.id}>
            <div className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:ring-1 hover:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-image.jpg'}
                  alt={book.volumeInfo.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.volumeInfo.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-1">
                {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}