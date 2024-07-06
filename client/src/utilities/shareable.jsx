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
    'o':      '⭕️',
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

    results.push({ square: squares.o, direction: squares.crown });
    
    return results;
};

const getDirection = (degrees) => {
    if (degrees >  350.0  || degrees <  10.0)   return directions.N; 
    if (degrees >  80.0   && degrees <  100.0)  return directions.E; 
    if (degrees >  170.0  && degrees <  190.0)  return directions.S; 
    if (degrees >  260.0  && degrees <  280.0)  return directions.W; 
    if (degrees >= 10.0   && degrees <= 80.0)   return directions.NE; 
    if (degrees >= 100.0  && degrees <= 170.0)  return directions.SE; 
    if (degrees >= 190.0  && degrees <= 260.0)  return directions.SW; 
    if (degrees >= 260.0  && degrees <= 350.0)  return directions.NW;
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