const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthenticationControl {
  static apiSecret = process.env.API_KEY;
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
