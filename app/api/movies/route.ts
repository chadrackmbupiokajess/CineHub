import { getPopularMovies, getPopularTvShows, getUpcomingMovies, getMoviesByGenre } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const page = searchParams.get("page");

  if (!type || !page) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    let data;
    switch (type) {
      case "movie":
        data = await getPopularMovies(parseInt(page));
        break;
      case "tv":
        data = await getPopularTvShows(parseInt(page));
        break;
      case "new":
        data = await getUpcomingMovies(parseInt(page));
        break;
      case "documentary":
        data = await getMoviesByGenre(99, parseInt(page));
        break;
      default:
        data = await getPopularMovies(parseInt(page));
    }
    return NextResponse.json(data.results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
