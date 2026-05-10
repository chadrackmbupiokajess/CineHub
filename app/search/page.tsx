import SearchResultsClient from "../../components/SearchResultsClient"; // Import the client component

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
  }> | {
    query?: string;
  };
}

export default async function SearchPage({ searchParams: rawSearchParams }: SearchPageProps) {
  // Await searchParams if it's a Promise, otherwise use it directly
  const searchParams = await Promise.resolve(rawSearchParams);
  const query = searchParams.query || ''; // Ensure query is always a string

  return (
    <div className="container mx-auto p-4 pt-16"> {/* Added pt-16 for fixed header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {query.trim() !== '' ? `Résultats de recherche pour "${query}"` : "Veuillez saisir un terme de recherche."}
      </h1>

      <SearchResultsClient initialQuery={query} />
    </div>
  );
}
