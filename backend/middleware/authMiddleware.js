const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');


    const token = authHeader?.replace('Bearer ', '');


    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log('JWT ERROR:', error.message);

    return res.status(401).json({
      error: 'Invalid token',
    });
  }
};