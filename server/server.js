const express = require('express');
const cors = require('cors');
const limit = require('express-rate-limit');
const AuthenticationControl = require('./src/access_control');

const app = express();
const auth = new AuthenticationControl();

const port = 4000;

const rateLimitMiddleware = limit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'You have exceeded your request limit.',
  skipFailedRequests: true,
  headers: true,
});

const corsSettings = {
  origin: 'http://localhost:5173',
};

//app.use(auth.authenticateApiKey);
app.use(cors(corsSettings));
app.use(rateLimitMiddleware);
app.use('/', express.static('metern', { index: '../index.html' }));
app.set('trust proxy', 1);

const countryRoute = require('./src/country');

app.use('/country', countryRoute);

app.listen({ port }, () => {
  console.log(`Server started on port ${port}`);
});
