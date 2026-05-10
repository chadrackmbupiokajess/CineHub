import { searchMovies } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const page = searchParams.get("page");

  if (!query || !page) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const data = await searchMovies(query, parseInt(page));
    return NextResponse.json(data.results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
