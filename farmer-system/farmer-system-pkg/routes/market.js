// routes/market.js
const express = require('express');
const db      = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/market — Public: all current prices (optional ?crop= filter)
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM MARKET_PRICE';
    const params = [];
    if (req.query.crop) {
      query += ' WHERE crop_name LIKE ?';
      params.push(`%${req.query.crop}%`);
    }
    query += ' ORDER BY date_updated DESC';
    const [rows] = await db.execute(query, params);

    // Add price change indicator
    const enriched = rows.map(r => ({
      ...r,
      change: r.prev_price ? +(r.current_price - r.prev_price).toFixed(2) : 0,
      change_pct: r.prev_price
        ? +((r.current_price - r.prev_price) / r.prev_price * 100).toFixed(1)
        : 0,
    }));
    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/market — Admin: add new price
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { crop_name, current_price, source_market, state } = req.body;
  if (!crop_name || !current_price || !source_market)
    return res.status(400).json({ error: 'crop_name, current_price, source_market required' });

  try {
    // Save old price for change tracking
    const [existing] = await db.execute(
      'SELECT current_price FROM MARKET_PRICE WHERE crop_name = ? AND source_market = ? ORDER BY date_updated DESC LIMIT 1',
      [crop_name, source_market]
    );
    const prev = existing.length ? existing[0].current_price : null;

    const [result] = await db.execute(
      'INSERT INTO MARKET_PRICE (crop_name, current_price, prev_price, source_market, state, admin_id) VALUES (?,?,?,?,?,?)',
      [crop_name, current_price, prev, source_market, state || 'Kerala', req.user.id]
    );
    res.status(201).json({ message: 'Price saved', price_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/market/:id — Admin: update price
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { current_price, source_market, state } = req.body;
  try {
    await db.execute(
      'UPDATE MARKET_PRICE SET current_price=COALESCE(?,current_price), source_market=COALESCE(?,source_market), state=COALESCE(?,state), date_updated=CURRENT_DATE WHERE price_id=?',
      [current_price || null, source_market || null, state || null, req.params.id]
    );
    res.json({ message: 'Price updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/market/:id — Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM MARKET_PRICE WHERE price_id = ?', [req.params.id]);
    res.json({ message: 'Price entry deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
