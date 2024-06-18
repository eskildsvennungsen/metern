const express = require('express');
const route = express.Router();

const db = require('better-sqlite3')('./data.sqlite3');

const allData = db.prepare('SELECT * FROM countries').all();

route.get('/country/:countryId?', (req, res) => {
  const countryId = req.params.countryId || Math.floor(Math.random() * allData.length);
  return res.json({ data: allData[countryId - 1] });
});

db.close();

module.exports = route;
