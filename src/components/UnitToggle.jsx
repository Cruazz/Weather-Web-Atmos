import React from "react";

export function UnitToggle({ units, onToggle }) {
  return (
    <button
      className="unit-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${units === "metric" ? "Fahrenheit" : "Celsius"}`}
    >
      <span>{units === "metric" ? "°C" : "°F"}</span>
    </button>
  );
}
