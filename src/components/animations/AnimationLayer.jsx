import React, { useMemo } from "react";

export function AnimationLayer({ weatherId, description }) {
  // Mapping the numeric ID to standard condition class
  const weatherType = useMemo(() => {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'mist';
    if (weatherId === 800) return 'clear';
    return 'cloudy';
  }, [weatherId]);

  // Generate unique randomized keyframe specs to fit performance budgets (< 50 particles)
  const particles = useMemo(() => {
    const list = [];
    let count = 0;
    if (weatherType === 'rain' || weatherType === 'thunderstorm') count = 35;
    if (weatherType === 'snow') count = 28;
    if (weatherType === 'cloudy') count = 4;

    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: weatherType === 'cloudy' ? `${Math.random() * 60 + 5}%` : `0%`,
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        duration: `${(Math.random() * 2 + (weatherType === 'cloudy' ? 12 : 1.2)).toFixed(2)}s`,
        size: weatherType === 'cloudy' ? `${Math.random() * 80 + 120}px` : `${Math.random() * 4 + 6}px`
      });
    }
    return list;
  }, [weatherType]);

  return (
    <div className="animation-visual-layer">
      <div className="weather-graphic-container">
        {weatherType === 'clear' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <div className="sun-animation" />
            <div className="sun-rays" />
          </div>
        )}

        {(weatherType === 'rain' || weatherType === 'thunderstorm') && (
          <>
            {weatherType === 'thunderstorm' && <div className="lightning-flash" />}
            {particles.map(p => (
              <div
                key={p.id}
                className="rain-drop"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                }}
              />
            ))}
          </>
        )}

        {weatherType === 'snow' && (
          <>
            {particles.map(p => (
              <div
                key={p.id}
                className="snowflake"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  width: p.size,
                  height: p.size
                }}
              />
            ))}
          </>
        )}

        {weatherType === 'cloudy' && (
          <>
            {particles.map(p => (
              <div
                key={p.id}
                className="cloud-drifter"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: `${parseFloat(p.size) * 0.45}px`,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                }}
              />
            ))}
          </>
        )}

        {weatherType === 'mist' && <div className="fog-layer" />}
      </div>

      <div className="animation-meta">
        {description || "Atmosphere conditions normal"}
      </div>
    </div>
  );
}
