import { useState, useEffect, useRef } from 'react';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import PopularMovies from './components/PopularMovies';
import { searchMovies, getMovieDetail } from './services/omdb';
import './App.css';

const DEFAULT_QUERIES = ['batman', 'avengers', 'star wars', 'john wick', 'mission impossible'];

function loadLiked() {
  try {
    const s = localStorage.getItem('likedMovies');
    return s ? new Set(JSON.parse(s)) : new Set();
  } catch { return new Set(); }
}

function loadLikedData() {
  try {
    const s = localStorage.getItem('likedMoviesData');
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [liked, setLiked] = useState(loadLiked);
  const [likedData, setLikedData] = useState(loadLikedData);
  const [activeTab, setActiveTab] = useState('movies');
  const debounceRef = useRef(null);

  useEffect(() => { loadFeatured(); }, []);

  async function loadFeatured() {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(DEFAULT_QUERIES.map(q => searchMovies(q)));
      const seen = new Set();
      const all = [];
      for (const { movies: ms } of results) {
        for (const m of (ms || [])) {
          if (!seen.has(m.imdbID)) {
            seen.add(m.imdbID);
            all.push(m);
          }
        }
      }
      setMovies(all);
      setTotalResults(0);
      setPage(1);
    } catch {
      setError('Failed to load movies. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query) {
    setSearch(query);
    setPage(1);
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      loadFeatured();
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const { movies: ms, total } = await searchMovies(query, 1);
        if (ms.length === 0) {
          setError('No movies found. Try a different title.');
          setMovies([]);
        } else {
          setMovies(ms);
          setTotalResults(total);
        }
      } catch {
        setError('Search failed. Try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  async function loadPage(newPage) {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const { movies: ms, total } = await searchMovies(search, newPage);
      setMovies(ms);
      setTotalResults(total);
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectMovie(movie) {
    const id = movie.imdbID;
    if (detailCache[id]) {
      setSelectedMovie(detailCache[id]);
      return;
    }
    setSelectedMovie({ ...movie, _loading: true });
    const detail = await getMovieDetail(id);
    const full = { ...detail };
    setDetailCache(prev => ({ ...prev, [id]: full }));
    setSelectedMovie(full);
    // Update likedData if this movie is liked and we now have full details
    if (liked.has(id)) {
      setLikedData(prev => {
        const next = { ...prev, [id]: full };
        localStorage.setItem('likedMoviesData', JSON.stringify(next));
        return next;
      });
    }
  }

  function handleToggleLike(movie) {
    const id = movie.imdbID;
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikedData(pd => {
          const nd = { ...pd };
          delete nd[id];
          localStorage.setItem('likedMoviesData', JSON.stringify(nd));
          return nd;
        });
      } else {
        next.add(id);
        const data = detailCache[id] || movie;
        setLikedData(pd => {
          const nd = { ...pd, [id]: data };
          localStorage.setItem('likedMoviesData', JSON.stringify(nd));
          return nd;
        });
      }
      localStorage.setItem('likedMovies', JSON.stringify([...next]));
      return next;
    });
  }

  const totalPages = search.trim() ? Math.ceil(totalResults / 10) : 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">MovieMaster</span>
          </div>
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'movies' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              Browse
            </button>
            <button
              className={`tab ${activeTab === 'popular' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('popular')}
            >
              Popular
              {liked.size > 0 && <span className="tab-badge">{liked.size}</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === 'movies' && (
          <>
            <div className="controls">
              <input
                className="search-input"
                type="text"
                placeholder="Search any movie..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
              {!search && <p className="featured-label">Featured picks — search to find any movie</p>}
            </div>

            {loading && (
              <div className="loading-state">
                <div className="spinner" />
                <span>Loading movies...</span>
              </div>
            )}

            {!loading && error && <p className="no-results">{error}</p>}

            {!loading && !error && movies.length > 0 && (
              <>
                <div className="movie-grid">
                  {movies.map(movie => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      liked={liked.has(movie.imdbID)}
                      onLike={() => handleToggleLike(movie)}
                      onSelect={() => handleSelectMovie(movie)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={page <= 1}
                      onClick={() => loadPage(page - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="page-info">Page {page} of {totalPages}</span>
                    <button
                      className="page-btn"
                      disabled={page >= totalPages}
                      onClick={() => loadPage(page + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'popular' && (
          <PopularMovies
            likedData={likedData}
            liked={liked}
            onSelect={handleSelectMovie}
            onLike={handleToggleLike}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          liked={liked.has(selectedMovie.imdbID)}
          onLike={() => handleToggleLike(selectedMovie)}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
