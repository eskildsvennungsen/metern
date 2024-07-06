const directions = {
    'N':  '⬆️',
    'NW': '↖️',
    'NE': '↗️',
    'W':  '⬅️',
    'E':  '➡️',
    'S':  '⬇️',
    'SW': '↙️',
    'SE': '↘️'
};

const squares = {
    'red':    '🟥',
    'orange': '🟧',
    'yellow': '🟨',
    'green':  '🟩',
    'crown':  '👑',
    'poop':   '💩',
    'pin':    '📍',
    'x':      '❌'
};

export const constructShareable = (guesses) => {
    const correctCountry = guesses.pop().country;
    const goal = { 'latitude': correctCountry.latitude, 'longitude': correctCountry.longitude };
    let results = [];

    guesses.forEach(country => {
        const guess = { 'latitude': country.country.latitude, 'longitude': country.country.longitude };
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
    if (degrees >  337.5  || degrees <  22.5)   return directions.N; 
    if (degrees >= 22.5   && degrees <= 67.5)   return directions.NE; 
    if (degrees >  67.5   && degrees <  112.5)  return directions.E; 
    if (degrees >= 112.5  && degrees <= 157.5)  return directions.SE; 
    if (degrees >  157.5  && degrees <  202.5)  return directions.S; 
    if (degrees >= 202.5  && degrees <= 247.5)  return directions.SW; 
    if (degrees >  247.5  && degrees <  292.5)  return directions.W; 
    if (degrees >= 292.5  && degrees <= 337.5)  return directions.NW;
}

const getBearing = (goal, guess) => {
    const theta_radians = Math.atan2(guess.longitude - goal.longitude, guess.latitude, goal.latitude);
    return (theta_radians + Math.PI) * 360.0 / (2.0 * Math.PI); // degrees (0 - 360) from guess, pointing to goal.
}

const getSquare = (distance) => {
    if (distance > 5000) return squares.red;
    else if (distance > 2500) return squares.orange;
    else if (distance > 0) return squares.yellow;
    else if (distance == 0) return squares.green;
}