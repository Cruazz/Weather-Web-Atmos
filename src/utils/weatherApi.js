// Direct API fetching for Atmos, no mock data fallback.
export const fetchGeocoding = async (query) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (!apiKey || apiKey === "your_openweathermap_key_here") {
    throw new Error("No OpenWeatherMap API key found. Please add your key to VITE_WEATHER_API_KEY in the .env file.");
  }

  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`);
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("401 Unauthorized: Your OpenWeatherMap API key is invalid or hasn't activated yet. Note that newly generated keys can take up to a few hours to activate.");
    }
    throw new Error(`API call failed with status ${res.status}. Please check your API key.`);
  }

  const data = await res.json();
  if (!data || data.length === 0) {
    throw new Error(`No locations matched your search "${query}".`);
  }

  return data;
};

export const fetchWeatherByCoords = async (lat, lon, units, name = "Your Location") => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (!apiKey || apiKey === "your_openweathermap_key_here") {
    throw new Error("No OpenWeatherMap API key found. Please add your key to VITE_WEATHER_API_KEY in the .env file.");
  }

  const cacheKey = `weather_${lat}_${lon}_${units}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return data;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`)
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    const errorStatus = !currentRes.ok ? currentRes.status : forecastRes.status;
    if (errorStatus === 401) {
      throw new Error("401 Unauthorized: Your OpenWeatherMap API key is invalid or hasn't activated yet. Note that newly generated keys can take up to a few hours to activate.");
    }
    throw new Error(`API requests failed with status ${errorStatus}.`);
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  // Determine Day/Night cycle
  const h = new Date().getHours();
  const isNight = h < 6 || h > 18;
  currentData.isNight = isNight;

  const combinedData = { current: currentData, forecast: forecastData };
  localStorage.setItem(cacheKey, JSON.stringify({ data: combinedData, timestamp: Date.now() }));
  return combinedData;
};
