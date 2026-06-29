# MovieMaster 🎬

A modern movie discovery web app built with React + Vite, powered by the [OMDB API](https://www.omdbapi.com/).

## Features

- **Browse Movies** — Featured picks loaded on startup across popular genres
- **Search** — Find any movie ever made via live OMDB search (debounced, paginated)
- **Movie Details** — Click any poster to see full plot, cast, director, runtime, rating, and awards
- **Like System** — One like per movie per user; click again to unlike (toggle)
- **Most Popular** — Dedicated tab showing all your liked movies with a live badge count
- **Persistent** — Likes survive page refreshes via localStorage

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [OMDB API](https://www.omdbapi.com/)

## Getting Started

### 1. Get an OMDB API key

Register for a free key at [omdbapi.com](https://www.omdbapi.com/apikey.aspx) (1,000 requests/day free).

### 2. Add your API key

Create a `.env` file in the `my-app` folder:

```
VITE_OMDB_API_KEY=your_key_here
```

### 3. Install dependencies & run

```bash
cd my-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
my-app/src/
├── services/
│   └── omdb.js              # OMDB API calls (search + detail)
├── components/
│   ├── MovieCard.jsx        # Grid card with poster + like button
│   ├── MovieModal.jsx       # Full detail modal (plot, cast, awards)
│   └── PopularMovies.jsx    # Liked movies leaderboard
├── App.jsx                  # Main layout, state, search, pagination
├── App.css                  # Dark cinema theme
└── index.css                # CSS variables + reset
```

## License

MIT
