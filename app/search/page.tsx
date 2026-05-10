import { searchMovies } from "../../lib/tmdb";
import InfiniteSearchList from "../../components/InfiniteSearchList";

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query;
  let movies = [];

  if (query) {
    const data = await searchMovies(query);
    movies = data.results;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {query ? `Résultats de recherche pour "${query}"` : "Rechercher des films"}
      </h1>
      {query && (
        <InfiniteSearchList initialItems={movies} query={query} />
      )}
      {!query && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          Veuillez entrer une recherche.
        </p>
      )}
    </div>
  );
}
