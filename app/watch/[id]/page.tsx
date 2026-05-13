"use client"; // This page will contain client-side interactivity (iframe)

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  const router = useRouter();

  const [showBackButton, setShowBackButton] = useState(false);
  const [language, setLanguage] = useState<'vf' | 'vostfr'>('vf');

  const [mediaDetails, setMediaDetails] = useState<any>(null);
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [showPlayer, setShowPlayer] = useState(false); // Controls visibility of the iframe and language selector

  useEffect(() => {
    const fetchMediaDetails = async () => {
      setLoading(true);
      setError(null);
      setMediaDetails(null);
      setMediaType(null);
      setSelectedSeason(null);
      setSelectedEpisode(null);
      setShowPlayer(false); // Reset player visibility

      const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // Ensure this is set in .env.local

      if (!TMDB_API_KEY) {
        setError("TMDB API Key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env.local file.");
        setLoading(false);
        return;
      }

      console.log("Fetching media details for movieId:", movieId);

      try {
        // Try fetching as a movie
        let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr`);
        let data = await response.json();
        console.log("TMDB Movie API Response:", data);

        if (response.ok && data && data.id) { // Check for data.id to confirm it's a valid movie object
          setMediaDetails(data);
          setMediaType('movie');
          setShowPlayer(true); // Auto-show player for movies
          console.log("Media Type set to: movie");
          console.log("Media Details:", data);
        } else {
          // If not a movie, try fetching as a TV series
          response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?api_key=${TMDB_API_KEY}&language=fr`);
          data = await response.json();
          console.log("TMDB TV API Response:", data);

          if (response.ok && data && data.id) { // Check for data.id to confirm it's a valid TV object
            setMediaDetails(data);
            setMediaType('tv');
            setShowPlayer(false); // Don't auto-show player for TV series, wait for selection
            console.log("Media Type set to: tv");
            console.log("Media Details:", data);

            // Set default season/episode for TV series
            if (data.seasons && data.seasons.length > 0) {
              const seasonsWithEpisodes = data.seasons.filter((s: any) => s.episode_count > 0);

              if (seasonsWithEpisodes.length > 0) {
                // Prefer season_number > 0, otherwise take the first available
                const firstValidSeason = seasonsWithEpisodes.find((s: any) => s.season_number > 0) || seasonsWithEpisodes[0];

                setSelectedSeason(firstValidSeason.season_number);
                setSelectedEpisode(1); // Default to first episode of the selected season
                console.log("Initial selectedSeason:", firstValidSeason.season_number, "Initial selectedEpisode:", 1);
              } else {
                // No seasons with episodes found
                setSelectedSeason(null);
                setSelectedEpisode(null);
                console.log("No seasons with episodes found.");
              }
            } else {
              // No seasons data at all
              setSelectedSeason(null);
              setSelectedEpisode(null);
              console.log("No seasons data at all.");
            }
          } else {
            setError("Média non trouvé ou une erreur est survenue.");
          }
        }
      } catch (err) {
        console.error("Échec du chargement des détails du média:", err);
        setError("Échec du chargement des détails du média.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMediaDetails();
    }
  }, [movieId]);

  const getVideoUrl = () => {
    if (mediaType === 'movie') {
      if (language === 'vf') {
        return `https://www.2embed.cc/embed/${movieId}`;
      } else {
        return `https://vidsrc.me/embed/movie?tmdb=${movieId}&ds_lang=fr&autoplay=1`;
      }
    } else if (mediaType === 'tv' && selectedSeason !== null && selectedEpisode !== null) {
      if (language === 'vf') {
        return `https://www.2embed.cc/embed/series?tmdb=${movieId}&season=${selectedSeason}&episode=${selectedEpisode}`;
      } else {
        return `https://vidsrc.me/embed/tv?tmdb=${movieId}&season=${selectedSeason}&episode=${selectedEpisode}&ds_lang=fr&autoplay=1`;
      }
    }
    return ''; // Return empty string if no valid media type or selection
  };

  const currentVideoUrl = getVideoUrl();

  return (
    <div
      className="w-screen h-screen bg-black relative"
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl bg-black bg-opacity-75 z-50">
          Chargement...
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xl bg-black bg-opacity-75 z-50">
          {error}
        </div>
      )}

      {!loading && !error && mediaDetails && (
        <>
          {/* TV Series Details Overlay */}
          {mediaType === 'tv' && !showPlayer && (
            <div className="absolute inset-0 flex items-center justify-center z-40 bg-black bg-opacity-90 p-8 overflow-auto">
              <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-2xl w-full text-white">
                <h1 className="text-3xl font-bold mb-4 text-center">{mediaDetails.name}</h1>
                <p className="text-md mb-2">
                  Genre: {mediaDetails.genres?.map((g: any) => g.name).join(', ') || 'N/A'}
                </p>
                <p className="text-md mb-4">
                  Nombre de saisons: {mediaDetails.number_of_seasons || 0}
                </p>
                <h2 className="text-xl font-semibold mt-4 mb-2">Synopsis:</h2>
                <p className="text-sm text-gray-300 mb-4">{mediaDetails.overview || 'N/A'}</p>

                <div className="flex flex-col gap-4 mb-4">
                  {/* Season Selector */}
                  <label htmlFor="season-select" className="block text-sm font-medium text-gray-300">
                    Sélectionner une saison:
                  </label>
                  <select
                    id="season-select"
                    value={selectedSeason || ''}
                    onChange={(e) => {
                      const seasonNum = parseInt(e.target.value);
                      setSelectedSeason(seasonNum);
                      const season = mediaDetails.seasons?.find((s: any) => s.season_number === seasonNum);
                      if (season && season.episode_count > 0) {
                        setSelectedEpisode(1);
                      } else {
                        setSelectedEpisode(null);
                      }
                    }}
                    className="block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Choisir une saison</option>
                    {mediaDetails.seasons?.filter((s: any) => s.episode_count > 0).map((season: any) => (
                      <option key={season.id} value={season.season_number}>
                        Saison {season.season_number} ({season.episode_count} épisodes)
                      </option>
                    ))}
                  </select>

                  {/* Episode Selector */}
                  {selectedSeason !== null && (
                    <>
                      <label htmlFor="episode-select" className="block text-sm font-medium text-gray-300">
                        Sélectionner un épisode:
                      </label>
                      <select
                        id="episode-select"
                        value={selectedEpisode || ''}
                        onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                        className="block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" disabled>Choisir un épisode</option>
                        {Array.from({
                          length: mediaDetails.seasons?.find((s: any) => s.season_number === selectedSeason)?.episode_count || 0,
                        }).map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            Épisode {index + 1}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                {selectedSeason !== null && selectedEpisode !== null && (
                  <button
                    onClick={() => setShowPlayer(true)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                  >
                    Regarder l'épisode {selectedEpisode} de la saison {selectedSeason}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Iframe and Language Selector (visible for movies or when showPlayer is true for TV) */}
          {(mediaType === 'movie' || showPlayer) && currentVideoUrl && (
            <>
              <iframe
                src={currentVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                frameBorder="0"
                className="w-full h-full"
                title={`Watch ${mediaType === 'movie' ? 'movie' : 'series'} ${mediaDetails.name || mediaDetails.title || movieId}`}
                key={`${language}-${selectedSeason}-${selectedEpisode}`}
              ></iframe>

              {/* Language Selector */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                <button
                  onClick={() => setLanguage('vf')}
                  className={`px-4 py-2 rounded-full font-bold transition-colors duration-200 ${
                    language === 'vf'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 bg-opacity-75 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  VF
                </button>
                <button
                  onClick={() => setLanguage('vostfr')}
                  className={`px-4 py-2 rounded-full font-bold transition-colors duration-200 ${
                    language === 'vostfr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 bg-opacity-75 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  VOSTFR
                </button>
              </div>
            </>
          )}

          {/* Back Button */}
          <button
            onClick={() => {
              if (mediaType === 'tv' && showPlayer) {
                setShowPlayer(false); // Go back to series details from player
              } else {
                router.back(); // Go back in browser history
              }
            }}
            className={`absolute top-4 left-4 p-3 bg-gray-800 bg-opacity-75 rounded-full text-white transition-opacity duration-300 z-50
              ${(mediaType === 'movie' || showPlayer) ? (showBackButton ? 'opacity-100' : 'opacity-0') : 'opacity-100'}
            `}
            aria-label="Retour"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}