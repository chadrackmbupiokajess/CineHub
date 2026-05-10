import { getPopularMovies, getTrending } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import HeroCarousel from "../components/HeroCarousel"; // Import HeroCarousel

export default async function Home() {
  const popularMovies = await getPopularMovies();
  const trendingItems = await getTrending("all", "week"); // Get trending movies and TV shows for the week

  return (
    <div>
      {/* Hero Carousel Section */}
      {trendingItems.results && trendingItems.results.length > 0 && (
        <HeroCarousel items={trendingItems.results} />
      )}

      {/* Popular Movies Section */}
      <div className="container mx-auto p-4 mt-8"> {/* Added mt-8 for spacing */}
        <h1 className="text-3xl font-bold mb-6 text-center">Films Populaires</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularMovies.results.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
