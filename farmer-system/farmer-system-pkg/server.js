// server.js — Digital Farmer Assistance System API
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend HTML from /public
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/farmers',  require('./routes/farmers'));
app.use('/api/market',   require('./routes/market'));
app.use('/api/weather',  require('./routes/weather'));
app.use('/api/advisory', require('./routes/advisory'));
app.use('/api/queries',  require('./routes/queries'));
app.use('/api/admins',   require('./routes/admins'));

// ── Dashboard stats endpoint ────────────────────────────────
const db = require('./db');
app.get('/api/stats', async (req, res) => {
  try {
    const [[{ farmers }]]  = await db.execute('SELECT COUNT(*) AS farmers  FROM FARMER');
    const [[{ queries }]]  = await db.execute("SELECT COUNT(*) AS queries  FROM QUERY WHERE status='pending'");
    const [[{ advisories }]] = await db.execute('SELECT COUNT(*) AS advisories FROM ADVISORY');
    const [[{ prices }]]   = await db.execute('SELECT COUNT(*) AS prices   FROM MARKET_PRICE');
    const [alerts]         = await db.execute("SELECT location FROM WEATHER_FORECAST WHERE is_extreme=TRUE AND forecast_date=CURRENT_DATE");
    res.json({ farmers, pending_queries: queries, advisories, price_records: prices, extreme_alerts: alerts.map(a=>a.location) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Catch-all → serve frontend ──────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌾  Farmer Assistance System running at http://localhost:${PORT}`);
  console.log(`📡  API base: http://localhost:${PORT}/api`);
  console.log(`\n   Seed admin credentials:`);
  console.log(`   Email: ravi@farmerassist.in  |  Password: admin123`);
  console.log(`   Farmer Phone: 9876543210     |  Password: farmer123\n`);
});
