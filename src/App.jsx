/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

/**
 * Import UI components
 */
import Logo from "./components/UI/Logo";
import NumResults from "./components/UI/NumResults";
import SearchBar from "./components/UI/SearchBar";
import ListBox from "./components/UI/ListBox";
import MovieList from "./components/movie/MovieList";
import WatchedList from "./components/movie/WatchedList";
import MovieDetails from "./components/movie/MovieDetails";
import Summary from "./components/UI/Summary";
import Loader from "./components/UI/Loader";
import ErrorMessage from "./components/UI/ErrorMessage";

const BASE_URL = "https://www.omdbapi.com/";
const KEY = "f3291f29";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  /**
   * Updates selectedId when user select a movie
   * @param {string} id - The IMDB ID of the movie
   */
  function handleSetSelectedId(id) {
    setSelectedId(id);
  }

  /**
   * Resets selectedId to null
   */
  function handleCloseMovie() {
    setSelectedId(null);
  }

  /**
   * Adds selected movie to watched list.
   * @param {Object}  newMovie - The movie object to be added
   */
  function handleAddWatched(newMovie) {
    setWatched((watched) => [...watched, newMovie]);
  }

  /**
   * Removes a movie from the watched list by its IMDB ID
   * @param {string} id - The IMDB ID of the movie to remove
   */
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  /**
   * Updates watched list and save data to localStorage
   */
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  /**
   * Fetches movies from OMDB API when query changes
   * @dependencies {string} query - Search keyword for movies
   */
  useEffect(
    function () {
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(`${BASE_URL}?s=${query}&apikey=${KEY}`);
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search);
        } catch (error) {
          // console.error(error.message);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      // If there's no keyword, reset status
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSetSelectedId} />
          )}

          {error && <ErrorMessage message={error} />}
        </ListBox>

        <ListBox>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} onDelete={handleDeleteWatched} />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
