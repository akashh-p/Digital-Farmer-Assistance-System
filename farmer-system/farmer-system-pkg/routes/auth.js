// routes/auth.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const router   = express.Router();

const SECRET = process.env.JWT_SECRET || 'secret';

// ── Farmer Registration ─────────────────────────────────────
// POST /api/auth/farmer/register
router.post('/farmer/register', async (req, res) => {
  const { name, phone, region, language_pref, password, preferred_crops } = req.body;
  if (!name || !phone || !region || !password)
    return res.status(400).json({ error: 'name, phone, region and password are required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      `INSERT INTO FARMER (name, phone, region, language_pref, password, preferred_crops)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, region, language_pref || 'en', hash, preferred_crops || '']
    );
    res.status(201).json({ message: 'Farmer registered', farmer_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Phone number already registered' });
    res.status(500).json({ error: err.message });
  }
});

// ── Farmer Login ────────────────────────────────────────────
// POST /api/auth/farmer/login
router.post('/farmer/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'phone and password required' });

  try {
    const [rows] = await db.execute('SELECT * FROM FARMER WHERE phone = ?', [phone]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const farmer = rows[0];
    const match  = await bcrypt.compare(password, farmer.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: farmer.farmer_id, type: 'farmer', name: farmer.name, region: farmer.region, lang: farmer.language_pref },
      SECRET, { expiresIn: '7d' }
    );
    res.json({ token, farmer: { farmer_id: farmer.farmer_id, name: farmer.name, region: farmer.region, language_pref: farmer.language_pref } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin Login ─────────────────────────────────────────────
// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const [rows] = await db.execute('SELECT * FROM ADMIN WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.admin_id, type: 'admin', name: admin.name, role: admin.role },
      SECRET, { expiresIn: '7d' }
    );
    res.json({ token, admin: { admin_id: admin.admin_id, name: admin.name, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
