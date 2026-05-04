import React from "react";

export function CurrentWeather({ data, units }) {
  if (!data) return null;

  const { name, main, weather, wind, sys } = data;
  const condition = weather?.[0];

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUnitSymbol = () => (units === "imperial" ? "°F" : "°C");
  const getSpeedSymbol = () => (units === "imperial" ? "mph" : "m/s");

  return (
    <div className="current-weather-grid">
      <div className="main-stat-card">
        <h2 className="location-title">
          <span>{name || "Your Location"}</span>
          {sys?.country && <span style={{ opacity: 0.65, fontSize: "1.1rem" }}>{sys.country}</span>}
        </h2>
        <div className="temperature-display">
          <span>{Math.round(main?.temp ?? 0)}</span>
          <span className="degree-symbol">{getUnitSymbol()}</span>
        </div>
        <p className="condition-desc">{condition?.description || "Clear Sky"}</p>
      </div>

      <div className="details-side-grid">
        <div className="detail-metric-card">
          <span className="metric-label">
            🌡️ Feels Like
          </span>
          <span className="metric-val">
            {Math.round(main?.feels_like ?? main?.temp ?? 0)}
            {getUnitSymbol()}
          </span>
        </div>

        <div className="detail-metric-card">
          <span className="metric-label">
            💧 Humidity
          </span>
          <span className="metric-val">{main?.humidity ?? 0}%</span>
        </div>

        <div className="detail-metric-card">
          <span className="metric-label">
            💨 Wind
          </span>
          <span className="metric-val">
            {Math.round(wind?.speed ?? 0)} {getSpeedSymbol()}
          </span>
        </div>

        <div className="detail-metric-card">
          <span className="metric-label">
            🧭 Pressure
          </span>
          <span className="metric-val">{main?.pressure ?? 1013} hPa</span>
        </div>

        <div className="detail-metric-card">
          <span className="metric-label">
            🌅 Sunrise
          </span>
          <span className="metric-val" style={{ fontSize: "1.15rem" }}>
            {formatTime(sys?.sunrise)}
          </span>
        </div>

        <div className="detail-metric-card">
          <span className="metric-label">
            🌇 Sunset
          </span>
          <span className="metric-val" style={{ fontSize: "1.15rem" }}>
            {formatTime(sys?.sunset)}
          </span>
        </div>
      </div>
    </div>
  );
}
