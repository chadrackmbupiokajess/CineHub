import DiscoverResultsClient from "../../components/DiscoverResultsClient"; // Import the client component

interface DiscoverPageProps {
  searchParams: {
    genre?: string;
    year?: string;
  };
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const genreId = searchParams.genre || '';
  const year = searchParams.year || '';

  return (
    <div className="container mx-auto p-4 pt-16"> {/* Added pt-16 for fixed header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Découvrir des films
        {(genreId || year) && (
          <span className="block text-xl text-gray-600 dark:text-gray-400 mt-2">
            {genreId && `par genre ${genreId}`}
            {genreId && year && " et "}
            {year && `par année ${year}`}
          </span>
        )}
      </h1>
      <DiscoverResultsClient initialGenreId={genreId} initialYear={year} />
    </div>
  );
}
