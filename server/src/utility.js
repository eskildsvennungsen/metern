const { DateTime } = require("luxon")

const getDate = () => {
  const time = DateTime.local();
  return `${time.year}-${time.month}-${time.day}`;
}

module.exports = { getDate }