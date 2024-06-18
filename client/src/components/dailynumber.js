export const dailyNumber = (max) => {
  const now = new Date();
  const dailyEpoc = Math.floor(now / 8.64e7);

  return Math.floor((dailyEpoc - 0) / (max - 0));
};
