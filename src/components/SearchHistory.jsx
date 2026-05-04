import React from "react";

export function SearchHistory({ history, onSelectCity }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-chips">
      {history.map((city, idx) => (
        <button
          key={`${city}-${idx}`}
          className="history-chip"
          onClick={() => onSelectCity(city)}
          aria-label={`View weather for ${city}`}
        >
          {city}
        </button>
      ))}
    </div>
  );
}
