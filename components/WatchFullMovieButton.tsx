"use client";

interface WatchFullMovieButtonProps {
  movieTitle: string;
}

export default function WatchFullMovieButton({ movieTitle }: WatchFullMovieButtonProps) {
  const handleWatchMovie = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(movieTitle)} film complet français`;
    window.open(searchUrl, '_blank');
  };

  return (
    <button
      onClick={handleWatchMovie}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg mb-6 transition-colors inline-block"
    >
      ▶️ Voir le film complet en français
    </button>
  );
}
