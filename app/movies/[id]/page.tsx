import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieImages } from "../../../lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "../../../components/MovieCard";
import TrailerPlayer from "../../../components/TrailerPlayer";
import MovieTrailerSection from "../../../components/MovieTrailerSection";
import LogoOverlay from "../../../components/LogoOverlay";
import FavoriteButton from "../../../components/FavoriteButton"; // Import the new component

// Removed "use client"; directive

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

  // Removed showLogo state and useEffect

  const [movie, credits, videos, similarMoviesData, movieImages] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getSimilarMovies(movieId),
    getMovieImages(movieId), // Fetch movie images
  ]);

  if (!movie) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-red-500">Film non trouvé</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Désolé, nous n'avons pas pu trouver les détails de ce film.
        </p>
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Retour à l'accueil
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

  const similarMovies = similarMoviesData?.results?.slice(0, 4) || [];

  // Extract director
  const director = credits.crew?.find((person: any) => person.job === "Director");

  // Get a few backdrops for the gallery
  const galleryImages = movieImages.backdrops?.slice(0, 6) || []; // Limit to 6 images for now

  return (
    <div className="pt-20 md:pt-8">
      {/* Back link - keep it within a container for readability */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Retour à l'accueil
        </Link>
      </div>

      {/* Main Movie Details Section - This will be full width */}
      <div className="relative mb-8 overflow-hidden bg-white dark:bg-gray-800">
        {/* Content Overlay - to ensure text is readable over background trailer */}
        {/* This div will contain the poster and text details */}
        <div className="relative z-20 flex flex-col md:flex-row gap-0"> {/* Removed p-4 md:p-8 here */}
          {/* Poster Image */}
          <div className="w-full md:w-[30%] flex-shrink-0 p-4 md:p-8"> {/* Added p-4 md:p-8 here */}
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
          <div className="w-full md:w-[70%] text-gray-900 md:text-white relative">
            {/* MovieTrailerSection handles background trailer for desktop and regular trailer for mobile */}
            {/* It will now be background for this 70% width div */}
            <MovieTrailerSection allTrailers={allTrailers} backgroundVideoDelay={4000} />

            {/* Logo Overlay */}
            <LogoOverlay src="/logo.png" alt="CineHub Logo" width={200} height={60} delay={3000} />

            <div className="relative z-20 p-4"> {/* Adjusted padding, text-white is inherited */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-gray-700 md:text-white text-base md:text-lg mb-4">{movie.overview}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-900 md:text-white">
                <p><strong>Note:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10 ({movie.vote_count} votes)</p>
                <p><strong>Date de sortie:</strong> {movie.release_date}</p>
                <p><strong>Durée:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
                <p><strong>Genres:</strong> {movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"}</p>
                {director && <p><strong>Réalisateur:</strong> {director.name}</p>}
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <p><strong>Langue:</strong> {movie.spoken_languages.map((lang: any) => lang.name).join(", ")}</p>
                )}
                {movie.production_countries && movie.production_countries.length > 0 && (
                  <p><strong>Pays de production:</strong> {movie.production_countries.map((country: any) => country.name).join(", ")}</p>
                )}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <p><strong>Studio:</strong> {movie.production_companies.map((company: any) => company.name).join(", ")}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-4">
                {/* Watch Full Movie Button */}
                <Link href={`/watch/${movieId}`} className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Voir le film complet
                </Link>

                {/* Favorite Button */}
                <FavoriteButton movieId={movieId} movieTitle={movie.title} />
              </div>

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
      </div>

      {/* Movie Image Gallery */}
      {galleryImages.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Galerie d'images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image: any, index: number) => (
              <div key={index} className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden rounded-lg shadow-md">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt={`Image de ${movie.title} ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Trailers (if any) */}
      {otherTrailers.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8">
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
        <div className="container mx-auto px-4 md:px-8 mt-8">
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
