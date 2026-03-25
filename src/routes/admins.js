// routes/admins.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../db');
const { authenticate, adminOnly, superadminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/admins — Admin only
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT admin_id, name, role, email, created_at FROM ADMIN ORDER BY created_at'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admins — Superadmin only: add new admin
router.post('/', authenticate, superadminOnly, async (req, res) => {
  const { name, role, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO ADMIN (name, role, email, password) VALUES (?,?,?,?)',
      [name, role || 'editor', email, hash]
    );
    res.status(201).json({ message: 'Admin created', admin_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already in use' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admins/:id — Superadmin only
router.delete('/:id', authenticate, superadminOnly, async (req, res) => {
  if (parseInt(req.params.id) === req.user.id)
    return res.status(400).json({ error: 'Cannot delete yourself' });
  try {
    await db.execute('DELETE FROM ADMIN WHERE admin_id = ?', [req.params.id]);
    res.json({ message: 'Admin deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
