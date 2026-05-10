import { getPopularMovies, getTrending, getPopularTvShows, getUpcomingMovies, getMoviesByGenre } from "../lib/tmdb";
import HeroCarousel from "../components/HeroCarousel";
import InfiniteMovieList from "../components/InfiniteMovieList";

interface HomePageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filterType = params.type;
  let displayItems: any[] = [];
  let sectionTitle = "Films Populaires";
  let showHero = true; // By default, show the hero carousel

  if (filterType) {
    showHero = false; // Hide hero if a filter is active
    switch (filterType) {
      case "movie":
        displayItems = (await getPopularMovies()).results;
        sectionTitle = "Films Populaires";
        break;
      case "tv":
        displayItems = (await getPopularTvShows()).results;
        sectionTitle = "Séries Populaires";
        break;
      case "new":
        displayItems = (await getUpcomingMovies()).results;
        sectionTitle = "Nouveautés (Films à venir)";
        break;
      case "documentary":
        // TMDb genre ID for Documentary is typically 99 for movies
        displayItems = (await getMoviesByGenre(99)).results;
        sectionTitle = "Documentaires";
        break;
      default:
        // Fallback to popular movies if an unknown filter is provided
        displayItems = (await getPopularMovies()).results;
        sectionTitle = "Films Populaires";
        showHero = true; // If filter is invalid, show hero
        break;
    }
  } else {
    // No filter, show popular movies and hero
    displayItems = (await getPopularMovies()).results;
  }

  const trendingItems = await getTrending("all", "week"); // Always fetch trending for hero, but only display if showHero is true

  return (
    <div>
      {/* Hero Carousel Section - Conditionally rendered */}
      {showHero && trendingItems.results && trendingItems.results.length > 0 && (
        <HeroCarousel items={trendingItems.results} />
      )}

      {/* Display Section */}
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{sectionTitle}</h1>
        <InfiniteMovieList 
          initialItems={displayItems}
          filterType={filterType}
        />
      </div>
    </div>
  );
}
