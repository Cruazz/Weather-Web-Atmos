I'll create a comprehensive Product Requirements Document (PRD) for this weather app. Let me first search for current best practices and any relevant updates for the tech stack mentioned.
 Based on your build plan and current best practices, here's a comprehensive **Product Requirements Document (PRD)** for the weather app:

---

# Product Requirements Document: WeatherVibe

## 1. Overview

**Product Name:** WeatherVibe  
**Type:** Single-page weather application  
**Target Platform:** Web (responsive, mobile-first)  
**Estimated Build Time:** ~11 hours across a weekend  
**Deployment:** Vercel (recommended) or Netlify 

---

## 2. Goals & Success Criteria

| Goal | Success Metric |
|------|---------------|
| Provide accurate, real-time weather data | API response < 2s, 99% uptime |
| Delight users with condition-matched animations | 60fps on mid-range devices |
| Work offline for previously searched cities | `localStorage` persistence |
| Load in under 3 seconds on 3G | Lighthouse performance score > 90 |

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | React 19 + Vite 6 | Fast HMR, optimized builds, zero-config deployment on Vercel  |
| Styling | Pure CSS + `@keyframes` | No animation library overhead; GPU-accelerated transforms  |
| Weather Data | OpenWeatherMap API | Free tier: 1,000 calls/day, 60 calls/min  |
| Geolocation | Browser Geolocation API | Native, no extra dependencies |
| State Management | React Hooks (`useState`, `useEffect`, `useCallback`) | Sufficient for app scope |
| Persistence | `localStorage` | Search history, unit preference |
| Deployment | Vercel | Zero-config for Vite, automatic preview deployments  |

---

## 4. API Specifications

### 4.1 OpenWeatherMap Free Tier Limits
- **Daily quota:** 1,000 API calls 
- **Rate limit:** 60 calls/minute 
- **Update frequency:** Model refreshes every ~10 minutes 
- **Recommended caching:** Cache results per location for 10 minutes to avoid quota waste

### 4.2 Endpoints Used

| Endpoint | Purpose | Parameters |
|----------|---------|------------|
| `GET /data/2.5/weather` | Current conditions | `q={city}&units={metric\|imperial}&appid={key}` |
| `GET /data/2.5/forecast` | 5-day/3-hour forecast | `q={city}&units={metric\|imperial}&appid={key}` |
| `GET /geo/1.0/direct` | Geocoding (city → lat/lon) | `q={city}&limit=1&appid={key}` |

### 4.3 Weather Condition Code Mapping

```js
const getWeatherType = (id) => {
  if (id >= 200 && id < 300) return 'thunderstorm';  // Lightning flash
  if (id >= 300 && id < 600) return 'rain';          // Falling drops
  if (id >= 600 && id < 700) return 'snow';           // Spinning flakes
  if (id >= 700 && id < 800) return 'mist';          // Fog overlay
  if (id === 800)             return 'clear';        // Animated sun + rays
  return 'cloudy';                                      // Drifting clouds
};
```

---

## 5. Feature Specifications

### 5.1 Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| City Search | Text input with autocomplete suggestions via Geocoding API | P0 |
| Geolocation | "Use My Location" button triggering `navigator.geolocation` | P0 |
| Current Weather | Temperature, humidity, wind speed, "feels like", weather description | P0 |
| 5-Day Forecast | Daily high/low, condition icon, precipitation chance | P0 |
| Day/Night Detection | Toggle UI theme based on sunrise/sunset times | P0 |

### 5.2 Animation Features (The "Wow Factor")

| Weather Type | Animation | CSS Technique |
|--------------|-----------|---------------|
| **Clear** | Pulsing sun with rotating rays | `transform: rotate()` + `scale()` keyframes |
| **Rain** | Falling droplets with splash effect | `translateY()` + pseudo-elements for splashes |
| **Snow** | Spinning hexagonal flakes drifting down | `rotate()` + `translateY()` with random delays |
| **Thunderstorm** | Screen flash + rain combo | `opacity` flash keyframe layered over rain |
| **Cloudy** | Multi-layer clouds drifting at different speeds | `translateX()` with staggered durations |
| **Mist/Fog** | Slow horizontal blur drift | `filter: blur()` + `translateX()` |

**Performance Requirements:**
- Use `transform` and `opacity` only (GPU-composited) 
- Respect `prefers-reduced-motion: reduce` media query 
- Limit concurrent animated elements to < 50 particles
- Pause animations when tab is inactive (`document.visibilityState`)

### 5.3 Nice-to-Have Features

| Feature | Description | Storage |
|---------|-------------|---------|
| °C/°F Toggle | Global unit switch, affects all displays | `localStorage` key: `weather-unit` |
| Search History | Last 10 searched cities, clickable | `localStorage` key: `weather-history` |
| Last Location | Auto-load weather for last viewed city on return | `localStorage` key: `weather-last-city` |

---

## 6. UI/UX Specifications

### 6.1 Layout Structure

```
┌─────────────────────────────────────┐
│  [🔍 Search...]    [📍 Use Location] │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────────────────┐      │
│    │   ANIMATION LAYER      │      │  ← Full-width, 40vh
│    │   (sun/rain/clouds)    │      │     Condition-matched
│    └─────────────────────────┘      │
│                                     │
│    ┌─────────────────────────┐      │
│    │   CURRENT WEATHER      │      │
│    │   24°C | Clear Sky      │      │
│    │   💧 45%  💨 12km/h     │      │
│    └─────────────────────────┘      │
│                                     │
│    ┌─────────────────────────┐      │
│    │   5-DAY FORECAST       │      │
│    │   Mon Tue Wed Thu Fri   │      │
│    │   24° 22° 19° 21° 23°   │      │
│    └─────────────────────────┘      │
│                                     │
│    [°C] [°F]  |  Recent: London,   │
│    Tokyo, Paris                      │
└─────────────────────────────────────┘
```

### 6.2 Design Tokens

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | `#87CEEB` (sky blue) | `#1a1a2e` (deep navy) |
| Card Background | `rgba(255,255,255,0.85)` | `rgba(30,30,46,0.85)` |
| Text Primary | `#1a1a1a` | `#e0e0e0` |
| Text Secondary | `#666666` | `#a0a0a0` |
| Accent | `#FF9500` (sun orange) | `#FFB84D` |
| Error | `#FF3B30` | `#FF453A` |

### 6.3 Responsive Breakpoints

| Breakpoint | Layout Adjustments |
|------------|-------------------|
| < 480px | Single column, stacked forecast cards, compact animation layer |
| 480–768px | 2-column forecast grid |
| > 768px | Max-width 800px centered, horizontal forecast row |

---

## 7. Component Architecture

```
src/
├── components/
│   ├── WeatherApp.jsx          # Root container, state orchestration
│   ├── SearchBar.jsx           # Input + geolocation button
│   ├── CurrentWeather.jsx      # Main display card
│   ├── ForecastList.jsx        # 5-day horizontal scroll/grid
│   ├── ForecastCard.jsx        # Single day mini-card
│   ├── UnitToggle.jsx          # °C/°F switch
│   ├── SearchHistory.jsx       # Recent cities chips
│   └── animations/
│       ├── AnimationLayer.jsx   # Container switching weather types
│       ├── SunAnimation.jsx
│       ├── RainAnimation.jsx
│       ├── SnowAnimation.jsx
│       ├── CloudAnimation.jsx
│       ├── ThunderAnimation.jsx
│       └── MistAnimation.jsx
├── hooks/
│   ├── useWeather.js           # Fetch + cache logic
│   ├── useGeolocation.js       # Browser geo wrapper
│   └── useLocalStorage.js      # Generic persistence hook
├── utils/
│   ├── weatherMapper.js        # API → UI data transformation
│   ├── conditionCodes.js      # ID → type mapping
│   └── formatters.js          # Temp, date formatting
├── styles/
│   ├── animations/
│   │   ├── sun.css
│   │   ├── rain.css
│   │   ├── snow.css
│   │   ├── clouds.css
│   │   ├── thunder.css
│   │   └── mist.css
│   ├── variables.css
│   └── main.css
└── App.jsx
```

---

## 8. Data Flow

```
User Action → SearchBar/Geolocation
    ↓
useWeather Hook
    ├──→ Geocoding API (if city name)
    ├──→ Current Weather API
    ├──→ 5-Day Forecast API
    └──→ Cache result (10 min TTL)
    ↓
Update State → WeatherApp
    ↓
Parallel Render:
    ├──→ AnimationLayer (weatherType class)
    ├──→ CurrentWeather (current data)
    ├──→ ForecastList (forecast data)
    └──→ SearchHistory (update localStorage)
```

---

## 9. Build Phases

### Phase 1: Foundation (2–3 hours)
- [ ] Initialize Vite + React project
- [ ] Set up folder structure
- [ ] Configure environment variables (`.env` with `VITE_WEATHER_API_KEY`)
- [ ] Build `useWeather` fetch hook with error handling
- [ ] Create basic `SearchBar` and `CurrentWeather` components

### Phase 2: Data Integration (2–3 hours)
- [ ] Integrate Current Weather API
- [ ] Integrate 5-Day Forecast API
- [ ] Build `ForecastList` with daily aggregation (API returns 3-hour intervals)
- [ ] Implement geolocation button with `navigator.geolocation`
- [ ] Add loading states and error boundaries

### Phase 3: Animations (3–4 hours)
- [ ] Build `AnimationLayer` container with CSS class switching
- [ ] Create `@keyframes` for each weather type:
  - Sun: rotating rays + gentle pulse
  - Rain: staggered drop fall with splash
  - Snow: random drift paths + rotation
  - Clouds: multi-speed parallax drift
  - Thunder: opacity flash overlay + rain base
  - Mist: slow blur pan
- [ ] Implement `prefers-reduced-motion` fallbacks
- [ ] Test performance on mobile (target 60fps)

### Phase 4: Polish & Deployment (2–3 hours)
- [ ] Add °C/°F toggle with `localStorage` persistence
- [ ] Implement search history (last 10 cities)
- [ ] Auto-load last searched city
- [ ] Responsive CSS fine-tuning
- [ ] Deploy to Vercel with `vercel.json` SPA routing 
- [ ] Lighthouse audit & optimization

---

## 10. Environment Setup

### 10.1 Required Files

**`.env` (never commit):**
```bash
VITE_WEATHER_API_KEY=your_openweathermap_key_here
```

**`vercel.json` (SPA routing):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 10.2 API Key Acquisition
1. Register at [openweathermap.org](https://openweathermap.org)
2. Navigate to **API Keys** tab
3. Generate key (activation may take up to 2 hours)
4. Subscribe to "Current Weather Data" and "5 Day / 3 Hour Forecast" (both free)

---

## 11. Performance & Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| **Loading** | Skeleton screens during API fetch |
| **Errors** | Graceful fallback: "City not found" with retry |
| **Accessibility** | `aria-label` on all interactive elements, focus management |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables animations  |
| **Offline** | Display cached data with timestamp when API fails |
| **SEO** | Semantic HTML, meta description, Open Graph tags |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API quota exhaustion | App stops working | Client-side caching (10 min), rate limit handling |
| Geolocation denied | "Use Location" fails | Graceful fallback to search input |
| Slow animation on low-end devices | Janky UX | `prefers-reduced-motion`, particle count reduction |
| API key exposed in client | Security issue | `.env` + Vite build-time injection only |

---

## 13. Future Enhancements (Post-MVP)

- [ ] Hourly forecast chart (Recharts)
- [ ] Weather alerts/notifications
- [ ] Multiple saved locations
- [ ] PWA with service worker
- [ ] Air quality index display

---

## 14. Appendix: Key Code Patterns

### 14.1 Vite Environment Variable Access
```js
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
```

### 14.2 Animation CSS Pattern
```css
/* GPU-accelerated, performant animation */
@keyframes rain-fall {
  0% { transform: translateY(-10vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110vh); opacity: 0; }
}

.rain-drop {
  animation: rain-fall 0.8s linear infinite;
  will-change: transform; /* Use sparingly */
}
```

### 14.3 Reduced Motion Fallback
```css
@media (prefers-reduced-motion: reduce) {
  .animation-layer * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

This PRD is ready for development. Want me to expand any section — like the full animation CSS, the `useWeather` hook implementation, or the component prop interfaces?
