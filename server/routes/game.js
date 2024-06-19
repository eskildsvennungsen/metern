const express = require('express');
const NodeCache = require('node-cache');
const route = express.Router();
const cache = new NodeCache();

route.get('/country/:countryId?', (req, res) => {
  const cacheKey = 'country';
  let cacheData = cache.get(cacheKey);

  if (!cacheData) {
    allData = getCountryDatabase();
    cache.set(cacheKey, allData);
    cacheData = allData;
  }

  let countryId = req.params.countryId || Math.floor(Math.random() * allData.length);
  let country = cacheData[countryId - 1];

  res.json({ data: country });
});

function getCountryDatabase() {
  const db = require('better-sqlite3')('./data.sqlite3');
  const allData = db.prepare('SELECT * FROM countries').all();
  db.close();
  return allData;
}

module.exports = route;
