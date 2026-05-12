import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Assuming react-icons is installed

interface StarRatingProps {
  rating: number; // Rating out of 10
  maxStars?: number; // Number of stars to display, default 5
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const starPercentage = (rating / 10) * maxStars;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (i <= starPercentage) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i - 0.5 <= starPercentage) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
