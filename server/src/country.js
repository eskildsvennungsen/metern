const express = require('express');
const NodeCache = require('node-cache');
const Database = require('better-sqlite3');

const route = express.Router();
const cache = new NodeCache();
const db = new Database('./countries.sqlite3');

function getDate() {
  return new Date().toISOString().split('T')[0];
}

route.get('/get', (req, res) => {
  const iso3Array = req.query.iso3 || [];
  if (iso3Array.length < 1) return res.status(400);

  const placeholders = iso3Array.map(() => '?').join(',');
  const query = `SELECT * FROM countries WHERE iso3 IN (${placeholders})`;

  try {
    const rows = db.prepare(query).all(...iso3Array);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).send('Internal Server Error');
  }
});

route.get('/check', (req, res) => {
  const cacheKey = 'solution';
  let solution = cache.get(cacheKey);
  const solutionNotAvailable = solution === undefined;
  const outdatedSolution = solutionNotAvailable ? true : solution.date !== getDate();

  try {
    const target = getCountry(req.query.target);

    if (solutionNotAvailable || outdatedSolution) {
      solution = getCountryOTD();
      cache.set(cacheKey, solution);
    }

    let distance;
    const borders = borderingSolution(target, solution);
    if (target.id === solution.countryId) {
      distance = -1;
    } else if (borders) {
      distance = 0;
    } else {
      distance = calculateDistance(target, solution);
    }

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

route.get('/countries', (req, res) => {
  try {
    const countries = db.prepare('SELECT name as label, queryName as value FROM countries').all();
    res.status(200).json(countries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch names for all countries' });
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

  const today = getDate();
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

function borderingSolution(target, solution) {
  if (target.id === solution.countryId) return false;

  const query = `
    SELECT *
    FROM borders 
    WHERE country_code = ? AND country_border_code = ?
  `;

  const result = db.prepare(query).all(solution.countryId.toString(), target.id.toString());
  return result.length > 0;
}

module.exports = route;
