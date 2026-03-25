// routes/weather.js
const express = require('express');
const axios   = require('axios');
const db      = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// ── Mock fallback data ───────────────────────────────────────
const MOCK = {
  Thrissur:  { temperature:32.5, feels_like:35.0, humidity:78, wind_speed:12.0, weather_condition:'Partly Cloudy', is_extreme:false },
  Palakkad:  { temperature:35.0, feels_like:38.0, humidity:65, wind_speed:15.0, weather_condition:'Sunny',         is_extreme:false },
  Ernakulam: { temperature:30.0, feels_like:33.0, humidity:90, wind_speed:8.0,  weather_condition:'Heavy Rain',    is_extreme:true  },
  Kozhikode: { temperature:29.5, feels_like:32.0, humidity:88, wind_speed:10.0, weather_condition:'Cloudy',        is_extreme:false },
  Wayanad:   { temperature:27.0, feels_like:28.5, humidity:92, wind_speed:9.0,  weather_condition:'Light Rain',    is_extreme:false },
  Kannur:    { temperature:31.0, feels_like:33.5, humidity:80, wind_speed:11.0, weather_condition:'Partly Cloudy', is_extreme:false },
};

async function fetchFromOWM(location, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric`;
  const { data } = await axios.get(url, { timeout: 6000 });
  const condMain = data.weather[0].main;
  const condDesc = data.weather[0].description
    .split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const extreme = ['Thunderstorm','Squall','Tornado'].includes(condMain)
    || data.wind.speed > 20
    || data.rain?.['1h'] > 50;
  return {
    temperature:       Math.round(data.main.temp * 10) / 10,
    feels_like:        Math.round(data.main.feels_like * 10) / 10,
    humidity:          data.main.humidity,
    wind_speed:        Math.round(data.wind.speed * 3.6 * 10) / 10, // m/s → km/h
    weather_condition: condDesc,
    is_extreme:        extreme,
  };
}

// GET /api/weather?locations=Thrissur,Palakkad
router.get('/', async (req, res) => {
  const apiKey = req.query.apikey || process.env.WEATHER_API_KEY;
  const useRealApi = apiKey && apiKey !== 'DEMO' && apiKey.length > 10;

  const requestedLocs = req.query.locations
    ? req.query.locations.split(',').map(l => l.trim()).filter(Boolean)
    : ['Thrissur', 'Palakkad', 'Ernakulam', 'Kozhikode'];

  const today = new Date().toISOString().slice(0, 10);
  const results = [];

  for (const location of requestedLocs) {
    // 1. Try live OWM API
    if (useRealApi) {
      try {
        const live = await fetchFromOWM(location, apiKey);
        // Upsert into DB
        const [exist] = await db.execute(
          'SELECT fc_id FROM WEATHER_FORECAST WHERE location=? AND forecast_date=?',
          [location, today]
        );
        if (exist.length) {
          await db.execute(
            'UPDATE WEATHER_FORECAST SET temperature=?,feels_like=?,humidity=?,wind_speed=?,weather_condition=?,is_extreme=?,fetched_at=NOW() WHERE fc_id=?',
            [live.temperature, live.feels_like, live.humidity, live.wind_speed, live.weather_condition, live.is_extreme, exist[0].fc_id]
          );
        } else {
          await db.execute(
            'INSERT INTO WEATHER_FORECAST (location,temperature,feels_like,humidity,wind_speed,weather_condition,is_extreme,forecast_date) VALUES (?,?,?,?,?,?,?,?)',
            [location, live.temperature, live.feels_like, live.humidity, live.wind_speed, live.weather_condition, live.is_extreme, today]
          );
        }
        results.push({ location, ...live, forecast_date: today, source: 'live' });
        continue;
      } catch (err) {
        console.warn(`OWM fetch failed for ${location}:`, err.message);
      }
    }

    // 2. Try DB for today
    try {
      const [rows] = await db.execute(
        'SELECT * FROM WEATHER_FORECAST WHERE location=? AND forecast_date=? ORDER BY fetched_at DESC LIMIT 1',
        [location, today]
      );
      if (rows.length) { results.push({ ...rows[0], source: 'database' }); continue; }
    } catch (e) {}

    // 3. Mock fallback
    const mock = MOCK[location] || { temperature:30, feels_like:32, humidity:75, wind_speed:10, weather_condition:'Partly Cloudy', is_extreme:false };
    results.push({ location, ...mock, forecast_date: today, source: 'demo' });
  }

  res.json(results);
});

// GET /api/weather/alerts
router.get('/alerts', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM WEATHER_FORECAST WHERE is_extreme=TRUE AND forecast_date=CURRENT_DATE'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/weather — Admin: manual entry
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { location, temperature, feels_like, humidity, wind_speed, weather_condition, is_extreme, forecast_date } = req.body;
  if (!location || temperature == null || !weather_condition)
    return res.status(400).json({ error: 'location, temperature, weather_condition required' });
  try {
    const [result] = await db.execute(
      'INSERT INTO WEATHER_FORECAST (location,temperature,feels_like,humidity,wind_speed,weather_condition,is_extreme,forecast_date) VALUES (?,?,?,?,?,?,?,?)',
      [location, temperature, feels_like||null, humidity||null, wind_speed||null, weather_condition, is_extreme||false, forecast_date||new Date().toISOString().slice(0,10)]
    );
    res.status(201).json({ message: 'Forecast saved', fc_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/weather/:id
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM WEATHER_FORECAST WHERE fc_id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
