const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from header
  const token = req.header('authorization');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    // The token string is "Bearer [token]", so we split it
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    
    // Add user from payload to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};