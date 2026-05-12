"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Assuming you have react-icons installed

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, movieTitle }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: any) => fav.id === movieId));
  }, [movieId]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((fav: any) => fav.id !== movieId);
    } else {
      // Add to favorites
      favorites.push({ id: movieId, title: movieTitle });
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className="flex items-center px-4 py-2 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition-colors duration-200 shadow-lg mt-4 mr-2"
    >
      {isFavorite ? (
        <FaHeart className="h-5 w-5 mr-2 text-red-500" />
      ) : (
        <FaRegHeart className="h-5 w-5 mr-2" />
      )}
      {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
};

export default FavoriteButton;
