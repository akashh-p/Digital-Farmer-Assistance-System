// routes/advisory.js
const express = require('express');
const db      = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/advisory — Public: filter by crop, season, language
router.get('/', async (req, res) => {
  try {
    const { crop, season, lang } = req.query;
    let query = `SELECT a.*, ad.name AS admin_name FROM ADVISORY a
                 JOIN ADMIN ad ON a.admin_id = ad.admin_id WHERE 1=1`;
    const params = [];
    if (crop)   { query += ' AND a.crop_type LIKE ?'; params.push(`%${crop}%`); }
    if (season) { query += ' AND a.season = ?';       params.push(season); }
    if (lang)   { query += ' AND a.language = ?';     params.push(lang); }
    query += ' ORDER BY a.last_updated DESC';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/advisory/for-farmer — Advisories matched to logged-in farmer's crops & region
router.get('/for-farmer', authenticate, async (req, res) => {
  if (req.user.type !== 'farmer') return res.status(403).json({ error: 'Farmers only' });
  try {
    const [farmers] = await db.execute(
      'SELECT preferred_crops, language_pref FROM FARMER WHERE farmer_id = ?', [req.user.id]
    );
    if (!farmers.length) return res.status(404).json({ error: 'Farmer not found' });

    const { preferred_crops, language_pref } = farmers[0];
    const crops = (preferred_crops || '').split(',').map(c => c.trim()).filter(Boolean);

    if (!crops.length) {
      // Return all in farmer's language
      const [all] = await db.execute('SELECT * FROM ADVISORY WHERE language = ? ORDER BY last_updated DESC', [language_pref]);
      return res.json(all);
    }

    // Return advisories for each preferred crop
    const placeholders = crops.map(() => '?').join(',');
    const [rows] = await db.execute(
      `SELECT * FROM ADVISORY WHERE crop_type IN (${placeholders}) AND language = ? ORDER BY last_updated DESC`,
      [...crops, language_pref]
    );
    // Fallback: also get English if no content in farmer's language
    let final = rows;
    if (!rows.length && language_pref !== 'en') {
      const [en] = await db.execute(
        `SELECT * FROM ADVISORY WHERE crop_type IN (${placeholders}) AND language = 'en' ORDER BY last_updated DESC`,
        crops
      );
      final = en;
    }
    res.json(final);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/advisory — Admin: create advisory
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { crop_type, season, growth_stage, content, language } = req.body;
  if (!crop_type || !season || !content)
    return res.status(400).json({ error: 'crop_type, season, content required' });
  try {
    const [result] = await db.execute(
      'INSERT INTO ADVISORY (crop_type, season, growth_stage, content, language, admin_id) VALUES (?,?,?,?,?,?)',
      [crop_type, season, growth_stage || null, content, language || 'en', req.user.id]
    );
    res.status(201).json({ message: 'Advisory published', adv_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/advisory/:id — Admin: update advisory
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { content, growth_stage } = req.body;
  try {
    await db.execute(
      'UPDATE ADVISORY SET content=COALESCE(?,content), growth_stage=COALESCE(?,growth_stage) WHERE adv_id=?',
      [content || null, growth_stage || null, req.params.id]
    );
    res.json({ message: 'Advisory updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/advisory/:id — Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM ADVISORY WHERE adv_id = ?', [req.params.id]);
    res.json({ message: 'Advisory deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
