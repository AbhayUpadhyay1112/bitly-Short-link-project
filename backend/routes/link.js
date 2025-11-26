// routes/links.js
const express = require('express');
const db = require('../db');
const { isValidCode, isValidUrl, generateRandomCode } = require('../utils/validators');
const router = express.Router();

/**
 * POST /api/links
 * body: { url: string, code?: string }
 * - validate url
 * - validate optional code with regex [A-Za-z0-9]{6,8}
 * - if code omitted, generate unique code
 * - return 201 with { code, url, shortUrl }
 * - return 409 if requested code already exists
 */
router.post('/', async (req, res) => {
  const { url, code: requestedCode } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  let code = requestedCode;
  if (code) {
    if (!isValidCode(code)) return res.status(400).json({ error: 'code must match [A-Za-z0-9]{6,8}' });
    try {
      const exists = await db.query('SELECT 1 FROM links WHERE code=$1', [code]);
      if (exists.rows.length) return res.status(409).json({ error: 'code already exists' });
    } catch (err) {
      console.error('DB error during code existence check', err);
      return res.status(500).json({ error: 'internal error' });
    }
  } else {
    // generate unique code
    let attempts = 0;
    let unique = false;
    while (!unique && attempts < 10) {
      code = generateRandomCode(6);
      try {
        const r = await db.query('SELECT 1 FROM links WHERE code=$1', [code]);
        if (!r.rows.length) unique = true;
      } catch (err) {
        console.error('DB error during code generation check', err);
        return res.status(500).json({ error: 'internal error' });
      }
      attempts++;
    }
    if (!unique) return res.status(500).json({ error: 'could not generate unique code' });
  }

  try {
    await db.query('INSERT INTO links(code, url) VALUES($1,$2)', [code, url]);
    const baseUrl = (process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`).replace(/\/$/, '');
    return res.status(201).json({ code, url, shortUrl: `${baseUrl}/${code}` });
  } catch (err) {
    console.error('DB insert error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

/**
 * GET /api/links
 * returns list of links ordered by created_at DESC
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    console.error('DB list error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

/**
 * GET /api/links/:code
 * returns single link metadata or 404
 */
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const { rows } = await db.query('SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code=$1', [code]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('DB get error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

/**
 * DELETE /api/links/:code
 */
router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM links WHERE code=$1', [code]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('DB delete error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
