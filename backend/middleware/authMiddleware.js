const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    console.log('AUTH HEADER:', authHeader);

    const token = authHeader?.replace('Bearer ', '');

    console.log('TOKEN:', token);

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('DECODED:', decoded);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log('JWT ERROR:', error.message);

    return res.status(401).json({
      error: 'Invalid token',
    });
  }
};