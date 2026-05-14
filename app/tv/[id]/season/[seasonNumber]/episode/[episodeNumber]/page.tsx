"use client";

import { useEffect, useState } from "react";
import { getTvDetails, getTvSeasonDetails, getTvEpisodeDetails } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

interface EpisodePageProps {
  params: Promise<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }> | {
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  };
}

export default function EpisodePage({ params: rawParams }: EpisodePageProps) {
  const [tvId, setTvId] = useState<number | null>(null);
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [episodeNumber, setEpisodeNumber] = useState<number | null>(null);
  const [tv, setTv] = useState<any>(null);
  const [season, setSeason] = useState<any>(null);
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await Promise.resolve(rawParams);
      setTvId(parseInt(resolved.id));
      setSeasonNumber(parseInt(resolved.seasonNumber));
      setEpisodeNumber(parseInt(resolved.episodeNumber));
    };
    resolveParams();
  }, [rawParams]);

  useEffect(() => {
    if (tvId === null || seasonNumber === null || episodeNumber === null) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tvData, seasonData, episodeData] = await Promise.all([
          getTvDetails(tvId),
          getTvSeasonDetails(tvId, seasonNumber),
          getTvEpisodeDetails(tvId, seasonNumber, episodeNumber),
        ]);
        setTv(tvData);
        setSeason(seasonData);
        setEpisode(episodeData);
      } catch (err) {
        console.error("Error fetching episode details:", err);
        setError("Impossible de charger les détails de l'épisode.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tvId, seasonNumber, episodeNumber]);

  if (loading || tvId === null || seasonNumber === null || episodeNumber === null) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chargement...</h1>
      </div>
    );
  }

  if (error || !tv || !season || !episode) {
    return (
      <div className="container mx-auto p-4 text-center pt-20 md:pt-8">
        <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{error}</p>
        <Link href={`/tv/${tvId}/season/${seasonNumber}`} className="text-blue-500 hover:underline inline-block mt-4">
          &larr; Retour à la saison
        </Link>
      </div>
    );
  }

  const videoUrl = `https://vidsrc.me/embed/tv?tmdb=${tvId}&season=${seasonNumber}&episode=${episodeNumber}&ds_lang=fr&autoplay=1`;

  return (
    <div className="pt-20 md:pt-8">
      {/* Back link */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <Link href={`/tv/${tvId}/season/${seasonNumber}`} className="text-blue-500 hover:underline inline-block">
          &larr; Retour à la saison
        </Link>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4 md:px-8 mb-8">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={episode.name}
          />
        </div>
      </div>

      {/* Episode Info */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Episode Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tv.name}</h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              S{seasonNumber} E{episodeNumber}: {episode.name}
            </h2>
            {episode.overview && (
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">{episode.overview}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {episode.air_date && (
                <span>Date de diffusion: {new Date(episode.air_date).toLocaleDateString('fr-FR')}</span>
              )}
              {episode.runtime && (
                <span>Durée: {episode.runtime} min</span>
              )}
              {episode.vote_average && (
                <span>Note: {episode.vote_average.toFixed(1)} / 10</span>
              )}
            </div>
          </div>

          {/* Episode Thumbnail */}
          {episode.still_path && (
            <div className="w-full md:w-64 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                alt={episode.name}
                width={500}
                height={281}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Other Episodes in Season */}
        {season.episodes && season.episodes.length > 1 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Autres épisodes de cette saison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {season.episodes
                .filter((ep: any) => ep.episode_number !== episodeNumber)
                .map((ep: any) => (
                  <Link
                    key={ep.id}
                    href={`/tv/${tvId}/season/${seasonNumber}/episode/${ep.episode_number}`}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {ep.still_path && (
                      <div className="relative w-full h-36">
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                          alt={ep.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {ep.episode_number}. {ep.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ep.air_date || "Date inconnue"}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
