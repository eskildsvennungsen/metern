const express = require('express');
const NodeCache = require('node-cache');
const Database = require('better-sqlite3');

const route = express.Router();
const db = new Database('./usr.sqlite3');

function getDate() {
  return new Date().toISOString().split('T')[0];
}

route.use((req, res, next) => {
  const today = getDate();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY,
      date DATE,
      ammount INT,
      totGuesses BIGINT,
      avgGuesses FLOAT
    )`;
  db.exec(createTableQuery);

  const todayStats = db.prepare('SELECT * FROM completions where date = ?').get(today);

  if (todayStats === undefined) {
    const addCountryOTDQuery = `
    INSERT INTO completions (date, ammount, totGuesses, avgGuesses)
    VALUES (?, ?, ?, ?)
    `;
    db.prepare(addCountryOTDQuery).run(today, 0, 0, 0);
  }

  next();
});

route.get('/comp', (req, res) => {
  const today = getDate();
  const todayStats = db.prepare('SELECT * FROM completions where date = ?').get(today);
  res.status(200).json(todayStats);
});

route.put('/comp', (req, res) => {
  const usrGuesses = parseInt(req.query.guesses);
  if (isNaN(usrGuesses)) {
    return res.status(400).json({ error: 'NaN value provided' });
  }
  if (usrGuesses > 170) {
    return res.status(400).json({ error: 'Fuck off' });
  }

  const today = getDate();
  const todayStats = db.prepare('SELECT * FROM completions where date = ?').get(today);

  const ammount = todayStats.ammount + 1;
  const total = todayStats.totGuesses + usrGuesses;
  const avg = total / ammount;

  console.log(ammount, total, avg);

  const updateQuery = `
    UPDATE completions
    SET ammount = ?, totGuesses = ?, avgGuesses = ?
    WHERE date = ?
    `;
  db.prepare(updateQuery).run(ammount, total, avg, today);
  res.json({ ammount: ammount, totGuesses: total, avgGuesses: avg });
});

module.exports = route;
