const jwt = require('jsonwebtoken');
const User = require('@models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id)
        .populate('role')
        .select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res
        .status(401)
        .json({ message: 'Not authorized, token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res
          .status(403)
          .json({ message: 'Not authorized: no role assigned' });
      }

      const userPerms = user.role.permissions || [];

      const hasAll = requiredPermissions.every((perm) =>
        userPerms.includes(perm)
      );

      if (!hasAll) {
        return res
          .status(403)
          .json({ message: 'Not authorized: permission denied' });
      }
      next();
    } catch (err) {
      console.error('Authorize error:', err.message);
      res.status(500).json({ message: 'Server error in authorize' });
    }
  };
};

module.exports = { protect, authorize };
