"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

// A simple list of genres
const genres = [
  'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'History', 'Biography', 'Philosophy', 'Science', 'Self-Help'
];

// A new component to handle genre selection
function GenrePicker({ selectedGenres, onToggleGenre }) {
  return (
    <div>
      <label className="block mb-2 font-medium">Favorite Genres</label>
      <p className="text-sm text-zinc-400 mb-3">Select at least one. This will help us recommend books you'll love.</p>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              type="button" // Important: prevents form submission
              key={genre}
              onClick={() => onToggleGenre(genre)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }
              `}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]); // <-- New state
  const { register } = useAuth();
  const router = useRouter();

  // New handler for toggling genres
  const handleToggleGenre = (genre) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) 
        ? prev.filter((g) => g !== genre) // Remove genre
        : [...prev, genre] // Add genre
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    // New check for genres
    if (selectedGenres.length === 0) {
      toast.error('Please select at least one favorite genre.');
      return;
    }
    
    try {
      // Pass genres to the register function
      await register(username, email, password, selectedGenres); 
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Create Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-700 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-700 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-700 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* New Genre Picker Component */}
        <GenrePicker 
          selectedGenres={selectedGenres} 
          onToggleGenre={handleToggleGenre} 
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}