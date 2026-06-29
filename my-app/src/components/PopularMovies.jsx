const PLACEHOLDER = 'https://placehold.co/48x72/18181b/a1a1aa?text=?';

export default function PopularMovies({ likedData, liked, onSelect, onLike }) {
  const likedMovies = Object.values(likedData).reverse();

  if (likedMovies.length === 0) {
    return (
      <section className="popular-section">
        <h2 className="section-title">Most Popular</h2>
        <p className="popular-empty">
          No liked movies yet — browse and like movies to see them here!
        </p>
      </section>
    );
  }

  return (
    <section className="popular-section">
      <h2 className="section-title">Most Popular</h2>
      <p className="popular-count">{likedMovies.length} liked movie{likedMovies.length !== 1 ? 's' : ''}</p>
      <ol className="popular-list">
        {likedMovies.map((movie, index) => {
          const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;
          const isLiked = liked.has(movie.imdbID);
          return (
            <li
              key={movie.imdbID}
              className="popular-item"
              onClick={() => onSelect(movie)}
            >
              <span className="popular-rank">#{index + 1}</span>
              <img
                className="popular-poster"
                src={poster}
                alt={movie.Title}
                onError={e => { e.currentTarget.src = PLACEHOLDER; }}
              />
              <div className="popular-info">
                <span className="popular-movie-title">{movie.Title}</span>
                <span className="popular-year">{movie.Year}</span>
              </div>
              <button
                className={`like-btn small-like-btn ${isLiked ? 'liked' : ''}`}
                onClick={e => { e.stopPropagation(); onLike(movie); }}
              >
                <span className="heart-icon">{isLiked ? '♥' : '♡'}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
