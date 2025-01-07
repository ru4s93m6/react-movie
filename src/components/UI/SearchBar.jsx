import { debounce } from "loadsh";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);
  const [localQuery, setLocalQuery] = useState(query);

  // Memoize the debounced function to maintain a stable reference
  // This prevents recreating the debounce timer on every render
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        setQuery(value);
      }, 500),
    [setQuery]
  );

  /**
   * Allows user to focus input element by hitting Enter key
   */
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter" || e.code === "NumpadEnter") {
          inputEl.current?.focus();
          setLocalQuery("");
        }
      }
      document.addEventListener("keydown", callback);

      return () => {
        document.removeEventListener("keydown", callback);
        debouncedSetQuery.cancel();
      };
    },
    [setQuery, debouncedSetQuery]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value); // immediately update searchbar

    debouncedSetQuery(value); // delay the search functionality
  };

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={localQuery}
      onChange={handleChange}
      ref={inputEl}
    />
  );
}
