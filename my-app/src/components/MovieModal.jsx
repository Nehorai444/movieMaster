import { useEffect } from 'react';

const PLACEHOLDER = 'https://placehold.co/200x300/18181b/a1a1aa?text=No+Poster';

export default function MovieModal({ movie, liked, onLike, onClose }) {
  const isLoading = movie._loading;
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;
  const genres = movie.Genre && movie.Genre !== 'N/A'
    ? movie.Genre.split(', ')
    : [];
  const rating = movie.imdbRating && movie.imdbRating !== 'N/A'
    ? movie.imdbRating
    : null;

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {isLoading ? (
          <div className="modal-loading">
            <div className="spinner" />
            <span>Loading details...</span>
          </div>
        ) : (
          <div className="modal-content">
            <div className="modal-poster-col">
              <img
                className="modal-poster"
                src={poster}
                alt={movie.Title}
                onError={e => { e.currentTarget.src = PLACEHOLDER; }}
              />
              <button className={`like-btn modal-like-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
                <span className="heart-icon">{liked ? '♥' : '♡'}</span>
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>
            </div>

            <div className="modal-details">
              <h2 className="modal-title">{movie.Title}</h2>

              <div className="modal-meta">
                {movie.Year && <span className="movie-year">{movie.Year}</span>}
                {rating && <span className="movie-rating">★ {rating}</span>}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="modal-runtime">{movie.Runtime}</span>
                )}
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="modal-rated">{movie.Rated}</span>
                )}
              </div>

              {movie.Director && movie.Director !== 'N/A' && (
                <p className="modal-director">Directed by {movie.Director}</p>
              )}

              {genres.length > 0 && (
                <div className="movie-genres modal-genres">
                  {genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
                </div>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <p className="modal-actors"><strong>Cast:</strong> {movie.Actors}</p>
              )}

              {movie.Plot && movie.Plot !== 'N/A' && (
                <p className="modal-description">{movie.Plot}</p>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <p className="modal-awards">🏆 {movie.Awards}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
