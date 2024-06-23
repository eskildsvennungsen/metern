const express = require('express');
const NodeCache = require('node-cache');
const Database = require('better-sqlite3');

const route = express.Router();
const cache = new NodeCache();
const db = new Database('./countries.sqlite3');

route.get('/check', (req, res) => {
  try {
    const target = getCountry(req.query.target);
    const solution = getCountryOTD();

    const distance = calculateDistance(target, solution);

    res.status(200).json({ country: target, distance: distance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

route.get('/random', (req, res) => {
  try {
    const country = getRandomCountry();
    res.status(200).json({ data: country });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch random country' });
  }
});

route.get('/today', (req, res) => {
  try {
    const cacheKey = 'country';
    let cacheData = cache.get(cacheKey);

    if (!cacheData) {
      const country = getCountryOTD();
      cache.set(cacheKey, country);
      cacheData = country;
    }

    res.status(200).json({ data: cacheData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch todays country' });
  }
});

function createCountryOTDIfNotExist() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS countryOTD (
      id INTEGER PRIMARY KEY,
      date DATE,
      countryId INT,
      FOREIGN KEY(countryId) REFERENCES countries(id) 
    )`;

  db.exec(createTableQuery);
}

function addCountryOTD(date) {
  const rows = db.prepare(`SELECT COUNT(*) AS count FROM countries`).get()['count'];
  const id = Math.floor(Math.random() * rows);

  const addCountryOTDQuery = `
    INSERT INTO countryOTD (date, countryID)
    VALUES (?, ?)
  `;

  db.prepare(addCountryOTDQuery).run(date, id);
}

function getCountryOTD() {
  createCountryOTDIfNotExist();

  const today = new Date().toISOString().split('T')[0];
  const countryOTD = db.prepare('SELECT * FROM countryOTD where date = ?').get(today);

  if (countryOTD === undefined) {
    addCountryOTD(today);
  }

  const getCountryQuery = `
    SELECT * FROM countries
    JOIN countryOTD on countries.id = countryOTD.countryID
    WHERE countryOTD.date = ?
  `;

  const country = db.prepare(getCountryQuery).get(today);

  return country;
}

function getRandomCountry() {
  const rows = db.prepare(`SELECT COUNT(*) AS count FROM countries`).get()['count'];
  const id = Math.floor(Math.random() * rows);
  const country = db.prepare('SELECT * FROM countries WHERE id = ? ').get(id);
  return country;
}

function getCountry(name) {
  name = name.toLowerCase().replace(' ', '_');
  return db.prepare('SELECT * FROM countries WHERE queryName = ? ').get(name);
}

function calculateDistance(from, to) {
  const deg2rad = (deg) => {
    return (deg * Math.PI) / 180;
  };

  const earthRadius = 6371; // In KM

  const deltaLon = deg2rad(to.longitude - from.longitude);
  const deltaLat = deg2rad(to.latitude - from.latitude);
  const x =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(deg2rad(from.latitude)) * Math.cos(deg2rad(from.latitude)) * Math.pow(Math.sin(deltaLon / 2), 2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  const distance = Math.floor(y * earthRadius);

  return distance;
}

module.exports = route;
