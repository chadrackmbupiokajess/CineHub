import { searchMovies } from "../../lib/tmdb";
import MovieCard from "../../components/MovieCard";

interface SearchPageProps {
  searchParams: {
    query?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query;
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
      {query && movies.length === 0 && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          Aucun film trouvé pour votre recherche.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
