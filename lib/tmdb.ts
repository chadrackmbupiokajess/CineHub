const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies(endpoint: string, params?: Record<string, string>) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not defined.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  url.searchParams.append("language", "fr-FR"); // Add language parameter for French results
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const response = await fetch(url.toString(), { 
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour in production
    });
    clearTimeout(timeoutId); // Clear the timeout if fetch completes

    if (!response.ok) {
      throw new Error(`Error fetching data from TMDb: ${response.statusText} (Status: ${response.status})`);
    }
    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId); // Ensure timeout is cleared even on error
    if (error.name === 'AbortError') {
      throw new Error(`Request to TMDb timed out after 10 seconds for endpoint: ${endpoint}`);
    }
    throw new Error(`Failed to fetch from TMDb for endpoint ${endpoint}: ${error.message}`);
  }
}

export async function getPopularMovies(page: number = 1) {
  return fetchMovies("/movie/popular", { page: page.toString() });
}

export async function getMovieDetails(id: number) {
  return fetchMovies(`/movie/${id}`);
}

export async function getMovieCredits(id: number) {
  return fetchMovies(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: number) {
  return fetchMovies(`/movie/${id}/videos`);
}

export async function getMovieImages(id: number) {
  return fetchMovies(`/movie/${id}/images`);
}

export async function getSimilarMovies(id: number) {
  return fetchMovies(`/movie/${id}/similar`);
}

export async function searchMovies(query: string, page: number = 1) {
  return fetchMovies("/search/movie", { query, page: page.toString() });
}

export async function getTrending(mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") {
  return fetchMovies(`/trending/${mediaType}/${timeWindow}`);
}

// New functions for filtering
export async function getPopularTvShows(page: number = 1) {
  return fetchMovies("/tv/popular", { page: page.toString() });
}

export async function getUpcomingMovies(page: number = 1) {
  return fetchMovies("/movie/upcoming", { page: page.toString() });
}

export async function getGenres(mediaType: "movie" | "tv" = "movie") {
  return fetchMovies(`/genre/${mediaType}/list`);
}

export async function getMoviesByGenre(genreId: number, page: number = 1) {
  return fetchMovies("/discover/movie", { with_genres: genreId.toString(), page: page.toString() });
}

export async function getTvShowsByGenre(genreId: number, page: number = 1) {
  return fetchMovies("/discover/tv", { with_genres: genreId.toString(), page: page.toString() });
}
