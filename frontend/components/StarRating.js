"use client";

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => !readOnly && setRating(currentRating)}
              className="hidden"
            />
            <FaStar
              size={24}
              className="cursor-pointer transition-colors duration-200"
              color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => !readOnly && setHover(currentRating)}
              onMouseLeave={() => !readOnly && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}