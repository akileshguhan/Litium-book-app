"use client";

import { useAuth } from '../context/AuthContext';
import UserReviewList from '../components/UserReviewList';
import Recommendations from '../components/Recommendations'; // <-- Import the new component

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="mt-10 space-y-16"> {/* Added spacing */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to LITIUM
        </h1>
        <p className="text-xl text-gray-300">
          {user ? 'Track your reading. Share your thoughts.' : 'Please log in to review books.'}
        </p>
      </div>

      {/* This is the new conditional section */}
      {user ? (
        <div className="space-y-16"> {/* Added spacing */}
          {/* Recommendation Section */}
          <section>
            <Recommendations />
          </section>

          {/* Reviewed Books Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Your Reviewed Books</h2>
            <UserReviewList />
          </section>
        </div>
      ) : (
        <div className="text-center p-6 bg-zinc-800 rounded-lg">
          <p className="text-lg">
            <a href="/login" className="text-blue-400 hover:underline">Log in</a> or <a href="/register" className="text-blue-400 hover:underline">register</a> to start building your personal library.
          </p>
        </div>
      )}
    </div>
  );
}