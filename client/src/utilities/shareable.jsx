const directions = {
  N: '⬆️',
  NW: '↖️',
  NE: '↗️',
  W: '⬅️',
  E: '➡️',
  S: '⬇️',
  SW: '↙️',
  SE: '↘️',
};

const squares = {
  red: '🟥',
  orange: '🟧',
  yellow: '🟨',
  green: '🟩',
  crown: '👑',
  poop: '💩',
  pin: '📍',
  x: '❌',
};

export const constructShareable = (guesses) => {
  const correctCountry = guesses.pop().country;
  const goal = { latitude: correctCountry.latitude, longitude: correctCountry.longitude };
  let results = [];

  guesses.forEach((country) => {
    const guess = { latitude: country.country.latitude, longitude: country.country.longitude };
    const bearing = getBearing(goal, guess);

    results.push({ square: getSquare(country.distance), direction: getDirection(bearing) });
  });

  if (results.length > 9) {
    let failedResult = results.slice(0, 8);
    failedResult.push({ square: squares.x, direction: squares.poop });
    return failedResult;
  }

  results.push({ square: squares.pin, direction: squares.crown });

  return results;
};

const getDirection = (degrees) => {
  if (degrees > 337.5 || degrees < 22.5) return directions.N;
  if (degrees >= 22.5 && degrees <= 67.5) return directions.NE;
  if (degrees > 67.5 && degrees < 112.5) return directions.E;
  if (degrees >= 112.5 && degrees <= 157.5) return directions.SE;
  if (degrees > 157.5 && degrees < 202.5) return directions.S;
  if (degrees >= 202.5 && degrees <= 247.5) return directions.SW;
  if (degrees > 247.5 && degrees < 292.5) return directions.W;
  if (degrees >= 292.5 && degrees <= 337.5) return directions.NW;
};

const getBearing = (goal, guess) => {
  const lat1 = guess.latitude;
  const lon1 = guess.longitude;
  const lat2 = goal.latitude;
  const lon2 = goal.longitude;

  // Convert latitude and longitude from coordinates to radians
  const toRadians = (deg) => deg * (Math.PI / 180);
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences
  const dLon = lon2Rad - lon1Rad;

  // Calculate the bearing
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const bearingRad = Math.atan2(y, x);

  // Convert the bearing from radians to degrees
  const bearingDeg = ((bearingRad * 180) / Math.PI + 360) % 360;

  return bearingDeg;
};

const getSquare = (distance) => {
  if (distance > 5000) return squares.red;
  else if (distance > 2500) return squares.orange;
  else if (distance > 0) return squares.yellow;
  else if (distance == 0) return squares.green;
};
