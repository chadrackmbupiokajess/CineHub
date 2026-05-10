import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies } from "../../../lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "../../../components/MovieCard";
import TrailerPlayer from "../../../components/TrailerPlayer";
import WatchFullMovieButton from "../../../components/WatchFullMovieButton";

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
      <div className="container mx-auto p-4 text-center">
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
  const otherTrailers = allTrailers.slice(1); // Other trailers for a separate section

  const similarMovies = similarMoviesData.results.slice(0, 4);

  return (
    <div className="container mx-auto p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Retour à l'accueil
      </Link>
      <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8 relative"> {/* Added relative */}
        <div className="md:w-1/3 flex-shrink-0 z-10"> {/* Added z-10 to image */}
          <Image
            src={imageUrl}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-lg shadow-md w-full h-auto"
            priority
          />
        </div>
        <div className="md:w-2/3 relative z-10"> {/* Added relative and z-10 */}
          {/* Background Trailer */}
          {backgroundTrailer && (
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <TrailerPlayer
                videoKey={backgroundTrailer.key}
                title={backgroundTrailer.name}
                isBackground={true}
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            </div>
          )}

          {/* Movie Details Content */}
          <div className="relative z-20 p-4 text-white"> {/* Added relative z-20 and text-white for readability */}
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-4">{movie.overview}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <p><strong>Note:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10 ({movie.vote_count} votes)</p>
              <p><strong>Date de sortie:</strong> {movie.release_date}</p>
              <p><strong>Durée:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
              <p><strong>Genres:</strong> {movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"}</p>
            </div>

            {/* Watch Full Movie Button */}
            <WatchFullMovieButton movieTitle={movie.title} />

            {/* Casting */}
            {credits.cast && credits.cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Casting</h2>
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
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Autres Bandes-annonces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTrailers.map((trailer: any) => (
              <TrailerPlayer
                key={trailer.key}
                videoKey={trailer.key}
                title={trailer.name}
                delay={0} // No delay for other trailers
              />
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Films similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarMovies.map((similarMovie: any) => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
