const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch(e) {}
  return { customers: [], jobs: [], expenses: [], status: {} };
}

function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

app.get('/api/data', (req, res) => { res.json(readDB()); });
app.post('/api/data', (req, res) => {
  try { writeDB(req.body); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.listen(PORT, () => console.log(`ProWindows running on port ${PORT}`));
