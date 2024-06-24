const express = require('express');
const NodeCache = require('node-cache');
const Database = require('better-sqlite3');

const route = express.Router();
const cache = new NodeCache();
const db = new Database('./countries.sqlite3');

function getDate() {
  return new Date().toISOString().split('T')[0];
}

route.get('/check', (req, res) => {
  const cacheKey = 'solution';
  let solution = cache.get(cacheKey);
  const solutionNotAvailiable = solution === undefined;
  const outdatedSolution = solution.date !== getDate();

  try {
    const target = getCountry(req.query.target);

    if (solutionNotAvailiable || outdatedSolution) {
      solution = getCountryOTD();
      cache.set(cacheKey, solution);
    }

    const distance = calculateDistance(target, solution);

    res.status(200).json({ country: target, distance: distance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

route.get('/load', (req, res) => {
  createCountryOTDTableIfNotExist();
  updateCountryOTDIfNotExist();

  const timesPlayed = db.prepare(`SELECT COUNT(*) AS count FROM countryOTD`).get()['count'];
  try {
    res.status(200).json({ played: timesPlayed });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch times played' });
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

function createCountryOTDTableIfNotExist() {
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
  createCountryOTDTableIfNotExist();
  updateCountryOTDIfNotExist();

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
  name = name.toLowerCase().replaceAll(' ', '_');
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

function updateCountryOTDIfNotExist() {
  const today = getDate();
  const countryOTD = db.prepare('SELECT * FROM countryOTD where date = ?').get(today);

  if (!countryOTD) {
    addCountryOTD(today);
  }
}

module.exports = route;
