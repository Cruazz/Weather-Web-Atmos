import React, { useState, useEffect, useRef } from "react";
import { fetchGeocoding } from "../utils/weatherApi";

export function SearchBar({ onSearch, onUseLocation, geoLoading }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchGeocoding(query);
        setSuggestions(results || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), null, null);
    setSuggestions([]);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    onSearch(item.name, item.lat, item.lon);
    setSuggestions([]);
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <form className="search-input-wrapper" onSubmit={handleFormSubmit}>
        <span className="search-icon" style={{ fontSize: "1.2rem", opacity: 0.8 }}>🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search your city or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search city or location"
        />

        {suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map((item, index) => (
              <div
                key={`${item.lat}-${item.lon}-${index}`}
                className="autocomplete-item"
                onClick={() => handleSuggestionClick(item)}
              >
                <strong>{item.name}</strong>
                {item.state && <span>, {item.state}</span>}
                {item.country && <span>, {item.country}</span>}
              </div>
            ))}
          </div>
        )}
      </form>

      <button
        type="button"
        className="geo-btn"
        onClick={onUseLocation}
        disabled={geoLoading}
        aria-label="Use My Location"
      >
        <span>{geoLoading ? "🔄 Locating..." : "📍 Use My Location"}</span>
      </button>
    </div>
  );
}
