const PLACEHOLDER = 'https://placehold.co/300x450/18181b/a1a1aa?text=No+Poster';

export default function MovieCard({ movie, liked, onLike, onSelect }) {
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;

  function handleLike(e) {
    e.stopPropagation();
    onLike();
  }

  return (
    <div className="movie-card" onClick={onSelect}>
      <div className="movie-poster-wrapper">
        <img
          className="movie-poster"
          src={poster}
          alt={movie.Title}
          loading="lazy"
          onError={e => { e.currentTarget.src = PLACEHOLDER; }}
        />
        <div className="movie-overlay">
          <p className="overlay-hint">Click to read more</p>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <span className="movie-year">{movie.Year}</span>
        <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
          <span className="heart-icon">{liked ? '♥' : '♡'}</span>
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>
      </div>
    </div>
  );
}
