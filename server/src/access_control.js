const jwt = require('jsonwebtoken');
require('dotenv').config();

const apiSecret = process.env.API_KEY;

class AuthenticationControl {
  authenticateApiKey(req, res, next) {
    const token = req.header.apiKey;

    if (!token) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    jwt.verify(token, apiSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  }
}

module.exports = AuthenticationControl;
