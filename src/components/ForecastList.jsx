import React, { useMemo } from "react";

export function ForecastList({ list, units }) {
  const getUnitSymbol = () => (units === "imperial" ? "°" : "°");

  const dailyForecasts = useMemo(() => {
    if (!list || list.length === 0) return [];

    const daysMap = {};
    list.forEach((item) => {
      const dateStr = item.dt_txt ? item.dt_txt.split(" ")[0] : new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!daysMap[dateStr]) {
        daysMap[dateStr] = {
          date: dateStr,
          min_temp: item.main.temp_min,
          max_temp: item.main.temp_max,
          weather: item.weather[0],
          humidity: item.main.humidity,
        };
      } else {
        daysMap[dateStr].min_temp = Math.min(daysMap[dateStr].min_temp, item.main.temp_min);
        daysMap[dateStr].max_temp = Math.max(daysMap[dateStr].max_temp, item.main.temp_max);
      }
    });

    return Object.values(daysMap).slice(0, 5);
  }, [list]);

  const getForecastIcon = (id) => {
    if (id >= 200 && id < 300) return <span style={{ fontSize: "1.75rem" }}>🌩️</span>;
    if (id >= 300 && id < 600) return <span style={{ fontSize: "1.75rem" }}>🌧️</span>;
    if (id >= 600 && id < 700) return <span style={{ fontSize: "1.75rem" }}>🌨️</span>;
    if (id >= 700 && id < 800) return <span style={{ fontSize: "1.75rem" }}>🌫️</span>;
    if (id === 800) return <span style={{ fontSize: "1.75rem" }}>☀️</span>;
    return <span style={{ fontSize: "1.75rem" }}>☁️</span>;
  };

  const getDayName = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const d = new Date(dateString);
    return days[d.getDay()];
  };

  if (dailyForecasts.length === 0) return null;

  return (
    <div className="forecast-section">
      <h3 className="forecast-header">
        📅 5-Day Forecast
      </h3>
      <div className="forecast-row">
        {dailyForecasts.map((day) => (
          <div key={day.date} className="forecast-item-card">
            <span className="forecast-day-label">{getDayName(day.date)}</span>
            <div className="forecast-icon">
              {getForecastIcon(day.weather?.id ?? 800)}
            </div>
            <div className="forecast-temp-spread">
              <span className="hi-temp">
                {Math.round(day.max_temp)}
                {getUnitSymbol()}
              </span>
              <span className="lo-temp">
                {Math.round(day.min_temp)}
                {getUnitSymbol()}
              </span>
            </div>
            <span className="forecast-cond">{day.weather?.main || "Clear"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
