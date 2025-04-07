
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  readonly?: boolean;
  size?: number;
  onRatingChange?: (rating: number) => void;
}

const StarRating = ({ 
  totalStars = 5, 
  initialRating = 0, 
  readonly = false, 
  size = 20,
  onRatingChange 
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [animated, setAnimated] = useState(-1);

  const handleRatingChange = (newRating: number) => {
    if (readonly) return;

    setRating(newRating);
    setAnimated(newRating - 1);
    setTimeout(() => setAnimated(-1), 300);

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        
        return (
          <button
            type="button"
            key={index}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} p-0.5 bg-transparent border-0 outline-none`}
            onClick={() => handleRatingChange(starValue)}
            onMouseEnter={() => !readonly && setHover(starValue)}
            onMouseLeave={() => !readonly && setHover(0)}
          >
            <Star
              size={size}
              className={`
                ${(hover || rating) >= starValue ? 'rating-active fill-warning' : 'text-gray-300'} 
                ${animated === index ? 'animate-pulse-rating' : ''}
                ${!readonly ? 'transition-colors duration-200' : ''}
              `}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
