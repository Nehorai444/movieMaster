const KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = 'https://www.omdbapi.com';

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE}/?s=${encodeURIComponent(query)}&type=movie&page=${page}&apikey=${KEY}`
  );
  const data = await res.json();
  if (data.Response === 'False') return { movies: [], total: 0 };
  return { movies: data.Search, total: parseInt(data.totalResults, 10) };
}

export async function getMovieDetail(imdbID) {
  const res = await fetch(`${BASE}/?i=${imdbID}&plot=full&apikey=${KEY}`);
  return res.json();
}
