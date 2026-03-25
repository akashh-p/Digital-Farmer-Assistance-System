// routes/farmers.js
const express = require('express');
const db      = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/farmers — Admin only: list all farmers
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT farmer_id, name, phone, region, language_pref, preferred_crops, created_at FROM FARMER ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/farmers/me — Logged-in farmer's own profile
router.get('/me', authenticate, async (req, res) => {
  if (req.user.type !== 'farmer') return res.status(403).json({ error: 'Farmers only' });
  try {
    const [rows] = await db.execute(
      'SELECT farmer_id, name, phone, region, language_pref, preferred_crops, created_at FROM FARMER WHERE farmer_id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/farmers/me — Update own profile
router.put('/me', authenticate, async (req, res) => {
  if (req.user.type !== 'farmer') return res.status(403).json({ error: 'Farmers only' });
  const { region, language_pref, preferred_crops } = req.body;
  try {
    await db.execute(
      'UPDATE FARMER SET region=COALESCE(?,region), language_pref=COALESCE(?,language_pref), preferred_crops=COALESCE(?,preferred_crops) WHERE farmer_id=?',
      [region || null, language_pref || null, preferred_crops || null, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/farmers/:id — Admin only
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM FARMER WHERE farmer_id = ?', [req.params.id]);
    res.json({ message: 'Farmer removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
