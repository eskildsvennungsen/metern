const express = require('express');
const Database = require('better-sqlite3');
const utility = require('./utility.js');
const route = express.Router();
const db = new Database('../db/usr.sqlite3');

route.use((req, res, next) => {
  const today = utility.getDate();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY,
      date DATE,
      todSolved TIME,
      ammount INT,
      totGuesses BIGINT,
      avgGuesses FLOAT
    )`;
  db.exec(createTableQuery);

  const todayStats = db.prepare('SELECT * FROM completions where date = ?').get(today);

  if (todayStats === undefined) {
    const addCountryOTDQuery = `
    INSERT INTO completions (date, todSolved, ammount, totGuesses, avgGuesses)
    VALUES (?, ?, ?, ?, ?)
    `;
    db.prepare(addCountryOTDQuery).run(today, '00:00:00', 0, 0, 0);
  }

  next();
});

route.get('/comp', (req, res) => {
  const today = utility.getDate();
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

  const today = utility.getDate();
  const todayStats = db.prepare('SELECT * FROM completions where date = ?').get(today);

  const ammount = todayStats.ammount + 1;
  const total = todayStats.totGuesses + usrGuesses;
  const avg = total / ammount;

  if (ammount === 1) {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const timestamp = `${hour}:${minutes}:${seconds}`;
    const updateQuery = `
      UPDATE completions
      SET todSolved = ?
      WHERE date = ?
      `;
    db.prepare(updateQuery).run(timestamp, today);
  }

  const updateQuery = `
    UPDATE completions
    SET ammount = ?, totGuesses = ?, avgGuesses = ?
    WHERE date = ?
    `;
  db.prepare(updateQuery).run(ammount, total, avg, today);

  return res.status(200).json({ ammount: ammount, totGuesses: total, avgGuesses: avg });
});

module.exports = route;
