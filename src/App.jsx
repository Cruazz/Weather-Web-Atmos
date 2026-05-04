import React, { useState, useEffect, useCallback } from "react";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { ForecastList } from "./components/ForecastList";
import { SearchHistory } from "./components/SearchHistory";
import { AnimationLayer } from "./components/animations/AnimationLayer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useGeolocation } from "./hooks/useGeolocation";
import { fetchWeatherByCoords, fetchGeocoding } from "./utils/weatherApi";

function App() {
  const [units, setUnits] = useLocalStorage("weather-units", "metric");
  const [theme, setTheme] = useLocalStorage("weather-theme", "dark");
  const [history, setHistory] = useLocalStorage("weather-history", [
    "London",
    "Tokyo",
    "Paris"
  ]);
  const [lastLocation, setLastLocation] = useLocalStorage("weather-last-city", {
    name: "London",
    lat: 51.5074,
    lon: -0.1278
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getPosition, loading: geoLoading } = useGeolocation();

  // Handle weather data load based on name, lat, lon
  const loadWeather = useCallback(async (name, lat, lon) => {
    setLoading(true);
    setError(null);

    let currentLat = lat;
    let currentLon = lon;

    try {
      if (lat === null || lon === null) {
        const geocodeResults = await fetchGeocoding(name);
        if (geocodeResults && geocodeResults.length > 0) {
          currentLat = geocodeResults[0].lat;
          currentLon = geocodeResults[0].lon;
          name = geocodeResults[0].name;
        } else {
          throw new Error(`Could not locate "${name}". Please check the name.`);
        }
      }

      const data = await fetchWeatherByCoords(currentLat, currentLon, units, name);
      setWeatherData(data);

      setLastLocation({ name, lat: currentLat, lon: currentLon });
      setHistory((prev) => {
        const filtered = prev.filter((city) => city.toLowerCase() !== name.toLowerCase());
        return [name, ...filtered].slice(0, 10);
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [units, setHistory, setLastLocation]);

  // Initial auto load
  useEffect(() => {
    if (lastLocation) {
      loadWeather(lastLocation.name, lastLocation.lat, lastLocation.lon);
    } else {
      loadWeather("London", 51.5074, -0.1278);
    }
  }, [units]);

  // Synchronize dynamic background styling via body element classlist
  useEffect(() => {
    if (!weatherData) return;
    const condId = weatherData.current?.weather?.[0]?.id || 800;
    const isNight = weatherData.current?.isNight;

    let conditionType = "clear";
    if (condId >= 200 && condId < 300) conditionType = "thunder";
    else if (condId >= 300 && condId < 600) conditionType = "rain";
    else if (condId >= 600 && condId < 700) conditionType = "snow";
    else if (condId >= 700 && condId < 800) conditionType = "mist";
    else if (condId > 800) conditionType = "cloudy";

    const newClassName = `${conditionType}-${isNight ? "night" : "day"}`;
    document.body.className = newClassName;

    return () => {
      document.body.className = "";
    };
  }, [weatherData]);

  const handleUseLocation = async () => {
    try {
      const pos = await getPosition();
      loadWeather("Your Location", pos.lat, pos.lon);
    } catch (err) {
      setError("Location access denied or unavailable. Falling back to search.");
    }
  };

  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`app-container ${theme}-mode`}>
      <header className="top-header">
        <div className="logo">
          <span>✨ Atmos</span>
        </div>

        <div className="controls-group">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Toggle to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            <span>{theme === "dark" ? "☀️ Light UI" : "🌙 Dark UI"}</span>
          </button>

          <button
            className="unit-toggle"
            onClick={toggleUnits}
            aria-label={`Switch to ${units === "metric" ? "Fahrenheit" : "Celsius"}`}
          >
            <span>{units === "metric" ? "°C" : "°F"}</span>
          </button>
        </div>
      </header>

      <SearchBar
        onSearch={loadWeather}
        onUseLocation={handleUseLocation}
        geoLoading={geoLoading}
      />

      <SearchHistory
        history={history}
        onSelectCity={(city) => loadWeather(city, null, null)}
      />

      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: theme === "dark" ? "#FCA5A5" : "#B91C1C",
          padding: "12px 18px",
          borderRadius: "14px",
          fontSize: "0.95rem",
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{
          height: "360px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px"
        }}>
          <span style={{ fontSize: "2.5rem", animation: "spin 2s linear infinite" }}>🔄</span>
          <span style={{ opacity: 0.75, fontWeight: 500 }}>Refreshing live forecast...</span>
        </div>
      ) : (
        <>
          <AnimationLayer
            weatherId={weatherData?.current?.weather?.[0]?.id || 800}
            description={weatherData?.current?.weather?.[0]?.description}
          />

          <CurrentWeather data={weatherData?.current} units={units} />

          <ForecastList list={weatherData?.forecast?.list} units={units} />
        </>
      )}
    </div>
  );
}

export default App;
