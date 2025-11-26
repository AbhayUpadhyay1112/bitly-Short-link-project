// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

//const linksRouter = require('./routes/links');
const linksRouter = require('./routes/link')


const app = express();

// Middlewares
app.use(helmet());
app.use(cors()); // For production, lock this down to your frontend origin
app.use(bodyParser.json());

// Health check
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// API routes
app.use('/api/links', linksRouter);

// Redirect route (handle short codes)
// This route is intentionally after /api so it doesn't conflict
const db = require('./db');
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const { rows } = await db.query('SELECT url FROM links WHERE code=$1', [code]);
    if (!rows.length) return res.status(404).send('Not found');
    const url = rows[0].url;
    await db.query('UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code=$1', [code]);
    return res.redirect(302, url);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TinyLink backend listening on port ${PORT}`);
});
