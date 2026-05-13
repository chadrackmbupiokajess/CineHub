import SearchResultsClient from "../../components/SearchResultsClient"; // Import the client component

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    year?: string;
  }> | {
    query?: string;
    genre?: string;
    year?: string;
  };
}

export default async function SearchPage({ searchParams: rawSearchParams }: SearchPageProps) {
  // Await searchParams if it's a Promise, otherwise use it directly
  const searchParams = await Promise.resolve(rawSearchParams);
  const query = searchParams.query || ''; // Ensure query is always a string
  const genreId = searchParams.genre || '';
  const year = searchParams.year || '';

  return (
    <div className="container mx-auto p-4 pt-16"> {/* Added pt-16 for fixed header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {query.trim() !== '' ? `Résultats de recherche pour "${query}"` : "Veuillez saisir un terme de recherche."}
        {(genreId || year) && (
          <span className="block text-xl text-gray-600 dark:text-gray-400 mt-2">
            {genreId && `par genre ${genreId}`}
            {genreId && year && " et "}
            {year && `par année ${year}`}
          </span>
        )}
      </h1>

      <SearchResultsClient initialQuery={query} initialGenreId={genreId} initialYear={year} />
    </div>
  );
}
