const express = require('express');
const cors = require('cors');
const limit = require('express-rate-limit');

const app = express();

const port = 4000;

const rateLimitMiddleware = limit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'You have exceeded your request limit.',
  skipFailedRequests: true,
  headers: true,
});

//app.set('trust proxy', 1);
app.use(rateLimitMiddleware);
app.use('/', express.static('metern', { index: '../index.html' }));
app.use(cors());

const countryRoute = require('./routes/country');

app.use('/country', countryRoute);

app.listen({ port }, () => {
  console.log(`Server started on port ${port}`);
});
