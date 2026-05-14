"use client";

import { useEffect, useState } from "react";
import { getTvDetails, getTvSeasonDetails } from "../../../../../lib/tmdb";
import Image from "next/image";
import Link from "next/link";

interface SeasonPageProps {
  params: Promise<{
    id: string;
    seasonNumber: string;
  }> | {
    id: string;
    seasonNumber: string;
  };
}

export default function SeasonPage({ params: rawParams }: SeasonPageProps) {
  const [tvId, setTvId] = useState<number | null>(null);
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [tv, setTv] = useState<any>(null);
  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await Promise.resolve(rawParams);
      setTvId(parseInt(resolved.id));
      setSeasonNumber(parseInt(resolved.seasonNumber));
    };
    resolveParams();
  }, [rawParams]);

  useEffect(() => {
    if (tvId === null || seasonNumber === null) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tvData, seasonData] = await Promise.all([
          getTvDetails(tvId),
          getTvSeasonDetails(tvId, seasonNumber),
        ]);
        setTv(tvData);
        setSeason(seasonData);
      } catch (err) {
        console.error("Error fetching season details:", err);
        setError("Impossible de charger les détails de la saison.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tvId, seasonNumber]);

  if (loading || tvId === null || seasonNumber === null) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chargement...</h1>
      </div>
    );
  }

  if (error || !tv || !season) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{error}</p>
        <Link href={`/tv/${tvId}`} className="text-blue-500 hover:underline inline-block mt-4">
          &larr; Retour à la série
        </Link>
      </div>
    );
  }

  const backdropUrl = season.poster_path
    ? `https://image.tmdb.org/t/p/original${season.poster_path}`
    : tv.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
    : "/no-image-placeholder.svg";

  return (
    <div className="pt-20 md:pt-8">
      {/* Back link */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <Link href={`/tv/${tvId}`} className="text-blue-500 hover:underline inline-block">
          &larr; Retour à la série
        </Link>
      </div>

      {/* Season Header */}
      <div className="relative mb-8">
        <div className="relative h-64 md:h-96">
          <Image
            src={backdropUrl}
            alt={season.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tv.name}</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-200">{season.name}</h2>
            <p className="text-gray-300 mt-2">{season.episodes.length} épisodes</p>
          </div>
        </div>
      </div>

      {/* Season Overview */}
      {season.overview && (
        <div className="container mx-auto px-4 md:px-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-lg">{season.overview}</p>
        </div>
      )}

      {/* Episodes */}
      <div className="container mx-auto px-4 md:px-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Épisodes</h3>
        <div className="space-y-4">
          {season.episodes.map((episode: any) => (
            <Link
              key={episode.id}
              href={`/tv/${tvId}/season/${seasonNumber}/episode/${episode.episode_number}`}
              className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row">
                {episode.still_path && (
                  <div className="relative w-full md:w-64 h-36 md:h-40 flex-shrink-0">
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                      alt={episode.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {episode.episode_number}. {episode.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {episode.air_date || "Date inconnue"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {episode.overview || "Aucune description disponible."}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
