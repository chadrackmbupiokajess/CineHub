import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies } from "../../../lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "../../../components/MovieCard";
import TrailerPlayer from "../../../components/TrailerPlayer";
import MovieTrailerSection from "../../../components/MovieTrailerSection";

interface MovieDetailsPageProps {
  params: Promise<{
    id: string;
  }> | {
    id: string;
  };
}

export default async function MovieDetailsPage({ params: rawParams }: MovieDetailsPageProps) {
  const params = await Promise.resolve(rawParams);
  const movieId = parseInt(params.id);

  const [movie, credits, videos, similarMoviesData] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getSimilarMovies(movieId),
  ]);

  if (!movie) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8"> {/* Keep container for error page */}
        <h1 className="text-3xl font-bold text-red-500">Film non trouvé</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Désolé, nous n'avons pas pu trouver les détails de ce film.
        </p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image-placeholder.svg";

  const allTrailers = videos.results.filter((video: any) => video.type === "Trailer" && video.site === "YouTube");
  const backgroundTrailer = allTrailers.length > 0 ? allTrailers[0] : null;

  const otherTrailers = backgroundTrailer ? [] : allTrailers.slice(0, 1);

  const similarMovies = similarMoviesData.results.slice(0, 4);

  return (
    <div className="pt-20 md:pt-8"> {/* Top padding for fixed header */}
      {/* Back link - keep it within a container for readability */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Retour à l'accueil
        </Link>
      </div>

      {/* Main Movie Details Section - This will be full width */}
      <div className="relative mb-8 overflow-hidden bg-white dark:bg-gray-800"> {/* No container, full width, added background */}
        {/* MovieTrailerSection handles background trailer for desktop and regular trailer for mobile */}
        <MovieTrailerSection allTrailers={allTrailers} />

        {/* Content Overlay - to ensure text is readable over background trailer */}
        {/* This div will contain the poster and text details */}
        <div className="relative z-20 flex flex-col md:flex-row gap-8 p-4 md:p-8"> {/* Added padding here */}
          {/* Poster Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg shadow-md w-full h-auto"
              priority
            />
          </div>
          {/* Text Details */}
          <div className="w-full md:w-2/3 text-gray-900 dark:text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4">{movie.overview}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <p><strong>Note:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10 ({movie.vote_count} votes)</p>
              <p><strong>Date de sortie:</strong> {movie.release_date}</p>
              <p><strong>Durée:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
              <p><strong>Genres:</strong> {movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"}</p>
            </div>

            {/* Watch Full Movie Button */}
            <Link href={`/watch/${movieId}`} className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Voir le film complet
            </Link>

            {/* Casting */}
            {credits.cast && credits.cast.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3">Casting</h2>
                <div className="flex flex-wrap gap-2">
                  {credits.cast.slice(0, 5).map((person: any) => (
                    <span key={person.cast_id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                      {person.name} ({person.character})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Trailers (if any) */}
      {otherTrailers.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8"> {/* Keep container for horizontal padding */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Autres Bandes-annonces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTrailers.map((trailer: any) => (
              <TrailerPlayer
                key={trailer.key}
                videoKey={trailer.key}
                title={trailer.name}
                delay={0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8"> {/* Keep container for horizontal padding */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Films similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarMovies.map((similarMovie: any) => (
              <MovieCard key={similarMovie.id} item={similarMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
