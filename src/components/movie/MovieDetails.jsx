import { useEffect, useState } from "react";
import StarRating from "../UI/StarRating";
import Loader from "../UI/Loader";

export default function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddWatched,
}) {
  const BASE_URL = "https://www.omdbapi.com/";
  const KEY = "f3291f29";
  const [movieInfo, setMovieInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieInfo;

  useEffect(
    function () {
      setIsLoading(true);
      async function fetchMovieDetails() {
        try {
          const response = await fetch(
            `${BASE_URL}?apikey=${KEY}&i=${selectedId}`
          );
          const data = await response.json();
          setMovieInfo(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  /**
   * Change title of website when toggle between homepage & movie detail page.
   */
  useEffect(
    function () {
      if (!title) return;
      // Update title name of page
      document.title = `Movie | ${title}`;
      // Clean up function to reset title
      return function () {
        document.title = "usePopcorn";
      };
    },

    [title]
  );

  /**
   * Allow user to escape movie detail page by pressing ESC button.
   */
  useEffect(
    function () {
      // Callback function
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);
      // cleanUp function
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      year,
      Poster: poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated the movie with {watchedUserRating} points.</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
