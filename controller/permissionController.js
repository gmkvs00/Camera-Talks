const permissions = require('@utils/permission');

const getPermissions = (req, res) => {
  res.json(permissions);
};

module.exports = { getPermissions };

// // GET /api/permissions
// const getPermissions = async (req, res) => {
//   try {
//     const permissions = await Permission.find().sort({ group: 1, view: 1 });
//     res.json(permissions);
//   } catch (err) {
//     console.error('Get permissions error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { getPermissions };
