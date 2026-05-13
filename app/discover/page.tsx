import DiscoverResultsClient from "../../components/DiscoverResultsClient"; // Import the client component
import { getGenres } from "../../lib/tmdb"; // Import getGenres to get genre names

interface DiscoverPageProps {
  searchParams: Promise<{
    genre?: string;
    year?: string;
  }> | {
    genre?: string;
    year?: string;
  };
}

export default async function DiscoverPage({ searchParams: rawSearchParams }: DiscoverPageProps) {
  const searchParams = await Promise.resolve(rawSearchParams);
  const genreId = searchParams.genre || '';
  const year = searchParams.year || '';

  // Fetch genres to get genre name
  let genreName = '';
  if (genreId) {
    try {
      const genresData = await getGenres("movie");
      const genre = genresData.genres.find((g: any) => g.id === parseInt(genreId));
      genreName = genre ? genre.name : '';
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  }

  return (
    <div className="container mx-auto p-4 pt-16"> {/* Added pt-16 for fixed header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Découvrir des films
        {(genreId || year) && (
          <span className="block text-xl text-gray-600 dark:text-gray-400 mt-2">
            {genreName && `par genre : ${genreName}`}
            {genreName && year && " et "}
            {year && `par année ${year}`}
          </span>
        )}
      </h1>
      <DiscoverResultsClient initialGenreId={genreId} initialYear={year} />
    </div>
  );
}
