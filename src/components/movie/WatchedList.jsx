import WatchedMovie from "./WatchedMovie";

export default function WatchedList({ watched, onDelete }) {
  return watched.length > 0 ? (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  ) : (
    <div className="empty-info">
      <p className="empty-info__message">There are no watched movies yet</p>
      <p className="empty-info__message">Feel free to add some movies</p>
    </div>
  );
}
