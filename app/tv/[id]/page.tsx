"use client"; // This page needs client-side interactivity for social sharing

import { getTvDetails, getTvCredits, getTvVideos, getSimilarTvShows, getTvImages } from "../../../lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "../../../components/MovieCard";
import TrailerPlayer from "../../../components/TrailerPlayer";
import MovieTrailerSection from "../../../components/MovieTrailerSection";
import LogoOverlay from "../../../components/LogoOverlay";
import FavoriteButton from "../../../components/FavoriteButton"; // Import the new component
import StarRating from "../../../components/StarRating"; // Import the StarRating component
import { useEffect, useState } from "react"; // Import useEffect and useState for client-side logic

interface TvDetailsPageProps {
  params: Promise<{
    id: string;
  }> | {
    id: string;
  };
}

export default function TvDetailsPage({ params: rawParams }: TvDetailsPageProps) {
  const [tvId, setTvId] = useState<number | null>(null);
  const [tv, setTv] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any>(null);
  const [similarTvShowsData, setSimilarTvShowsData] = useState<any>(null);
  const [tvImages, setTvImages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve rawParams and set tvId
  useEffect(() => {
    const resolveAndSetTvId = async () => {
      const resolved = await Promise.resolve(rawParams);
      setTvId(parseInt(resolved.id));
    };
    resolveAndSetTvId();
  }, [rawParams]);

  // Fetch data once tvId is available
  useEffect(() => {
    if (tvId === null) return; // Don't fetch until tvId is set

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tvData, creditsData, videosData, similarTvShowsDataResult, tvImagesData] = await Promise.all([
          getTvDetails(tvId),
          getTvCredits(tvId),
          getTvVideos(tvId),
          getSimilarTvShows(tvId),
          getTvImages(tvId),
        ]);

        setTv(tvData);
        setCredits(creditsData);
        setVideos(videosData);
        setSimilarTvShowsData(similarTvShowsDataResult);
        setTvImages(tvImagesData);
      } catch (err) {
        console.error("Error fetching TV show details:", err);
        setError("Impossible de charger les détails de la série.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tvId]); // Depend on tvId

  if (loading || tvId === null) { // Also check tvId for initial loading state
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chargement...</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Veuillez patienter pendant le chargement des détails de la série.
        </p>
      </div>
    );
  }

  if (error || !tv) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-red-500">Série non trouvée</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Désolé, nous n'avons pas pu trouver les détails de cette série. {error}
        </p>
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Retour à l'accueil
        </Link>
      </div>
    );
  }

  const imageUrl = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : "/no-image-placeholder.svg";

  const allTrailers = videos?.results?.filter((video: any) => video.type === "Trailer" && video.site === "YouTube") || [];
  const backgroundTrailer = allTrailers.length > 0 ? allTrailers[0] : null;

  const otherTrailers = backgroundTrailer ? [] : allTrailers.slice(0, 1);

  const similarTvShows = similarTvShowsData?.results?.slice(0, 4) || [];

  // Extract creators (TV shows have creators instead of directors)
  const creators = tv?.created_by || [];

  // Get a few backdrops for the gallery
  const galleryImages = tvImages?.backdrops?.slice(0, 6) || []; // Limit to 6 images for now

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Lien copié dans le presse-papiers !");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Impossible de copier le lien.");
    }
  };

  return (
    <div className="pt-20 md:pt-8">
      {/* Back link - keep it within a container for readability */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Retour à l'accueil
        </Link>
      </div>

      {/* Main TV Details Section - This will be full width */}
      <div className="relative mb-8 overflow-hidden bg-white dark:bg-gray-800">
        {/* Content Overlay - to ensure text is readable over background trailer */}
        {/* This div will contain the poster and text details */}
        <div className="relative z-20 flex flex-col md:flex-row gap-0"> {/* Removed p-4 md:p-8 here */}
          {/* Poster Image */}
          <div className="w-full md:w-[30%] flex-shrink-0 p-4 md:p-8"> {/* Added p-4 md:p-8 here */}
            <Image
              src={imageUrl}
              alt={tv.name}
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tv.name}</h1>
              <p className="text-gray-700 md:text-white text-base md:text-lg mb-4">{tv.overview}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-900 md:text-white">
                <div className="flex items-center gap-2">
                  <strong>Note:</strong>
                  {tv.vote_average ? (
                    <>
                      <StarRating rating={tv.vote_average} />
                      <span>{tv.vote_average.toFixed(1)} / 10 ({tv.vote_count} votes)</span>
                    </>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
                <p><strong>Première diffusion:</strong> {tv.first_air_date}</p>
                {tv.number_of_seasons && <p><strong>Saisons:</strong> {tv.number_of_seasons}</p>}
                {tv.number_of_episodes && <p><strong>Épisodes:</strong> {tv.number_of_episodes}</p>}
                <p><strong>Genres:</strong> {tv.genres?.map((genre: any) => genre.name).join(", ") || "N/A"}</p>
                {creators && creators.length > 0 && (
                  <p><strong>Créateurs:</strong> {creators.map((creator: any) => creator.name).join(", ")}</p>
                )}
                {tv.spoken_languages && tv.spoken_languages.length > 0 && (
                  <p><strong>Langue:</strong> {tv.spoken_languages.map((lang: any) => lang.name).join(", ")}</p>
                )}
                {tv.production_countries && tv.production_countries.length > 0 && (
                  <p><strong>Pays de production:</strong> {tv.production_countries.map((country: any) => country.name).join(", ")}</p>
                )}
                {tv.networks && tv.networks.length > 0 && (
                  <p><strong>Chaînes:</strong> {tv.networks.map((network: any) => network.name).join(", ")}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-4">
                {/* Favorite Button */}
                {tvId !== null && tv && ( // Ensure tvId and tv are not null
                  <FavoriteButton movieId={tvId} movieTitle={tv.name} />
                )}

                {/* Social Share Buttons */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  aria-label="Partager sur Facebook"
                >
                  <svg fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.73 9-4.72 9-9.95z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Découvrez cette série sur CineHub : ${tv.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-lg"
                  aria-label="Partager sur X (Twitter)"
                >
                  <svg fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.873L4.925 21.75H1.613l7.393-8.467L1.33 2.25H8.03c2.572 0 4.044 1.55 5.06 3.14L18.244 2.25zm-3.826 1.834l-1.353 1.675L5.23 20.5H6.9L12.447 13.8l1.352-1.675L18.77 3.5H17.1L14.418 4.084z" />
                  </svg>
                </a>
                <button
                  onClick={handleShareLink}
                  className="inline-flex items-center justify-center w-12 h-12 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-600 transition-colors duration-200 shadow-lg"
                  aria-label="Copier le lien"
                >
                  <svg fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>

              {/* Casting */}
              {credits?.cast && credits.cast.length > 0 && (
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

      {/* TV Image Gallery */}
      {galleryImages.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Galerie d'images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image: any, index: number) => (
              <div key={index} className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden rounded-lg shadow-md">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt={`Image de ${tv.name} ${index + 1}`}
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

      {/* Similar TV Shows */}
      {similarTvShows.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Séries similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarTvShows.map((similarTvShow: any) => (
              <MovieCard key={similarTvShow.id} item={{...similarTvShow, media_type: 'tv'}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
