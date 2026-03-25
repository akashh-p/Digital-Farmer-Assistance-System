// routes/queries.js
const express = require('express');
const db      = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/queries — Admin: all queries; Farmer: own queries
router.get('/', authenticate, async (req, res) => {
  try {
    let rows;
    if (req.user.type === 'admin') {
      [rows] = await db.execute(
        `SELECT q.*, f.name AS farmer_name, f.region, a.name AS admin_name
         FROM QUERY q
         JOIN FARMER f ON q.farmer_id = f.farmer_id
         LEFT JOIN ADMIN a ON q.admin_id = a.admin_id
         ORDER BY q.submitted_date DESC`
      );
    } else {
      [rows] = await db.execute(
        `SELECT q.*, a.name AS admin_name
         FROM QUERY q LEFT JOIN ADMIN a ON q.admin_id = a.admin_id
         WHERE q.farmer_id = ? ORDER BY q.submitted_date DESC`,
        [req.user.id]
      );
    }
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/queries — Farmer: submit query
router.post('/', authenticate, async (req, res) => {
  if (req.user.type !== 'farmer') return res.status(403).json({ error: 'Farmers only' });
  const { subject, description } = req.body;
  if (!subject || !description)
    return res.status(400).json({ error: 'subject and description required' });
  try {
    const [result] = await db.execute(
      'INSERT INTO QUERY (subject, description, farmer_id) VALUES (?,?,?)',
      [subject, description, req.user.id]
    );
    res.status(201).json({ message: 'Query submitted', query_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/queries/:id/respond — Admin: respond to a query
router.put('/:id/respond', authenticate, adminOnly, async (req, res) => {
  const { response } = req.body;
  if (!response) return res.status(400).json({ error: 'response text required' });
  try {
    await db.execute(
      "UPDATE QUERY SET response=?, status='answered', admin_id=? WHERE query_id=?",
      [response, req.user.id, req.params.id]
    );
    res.json({ message: 'Response saved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/queries/:id/close — Admin or farmer: close query
router.put('/:id/close', authenticate, async (req, res) => {
  try {
    await db.execute("UPDATE QUERY SET status='closed' WHERE query_id=?", [req.params.id]);
    res.json({ message: 'Query closed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/queries/:id — Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.execute('DELETE FROM QUERY WHERE query_id = ?', [req.params.id]);
    res.json({ message: 'Query deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
