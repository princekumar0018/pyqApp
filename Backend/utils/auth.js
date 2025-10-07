const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // ✅ lowercase
  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  // ✅ Extract the token after "Bearer "
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 400, message: 'Login first', loginStatus: 0 });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
