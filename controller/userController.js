const User = require('../models/User');
const Role = require('../models/Role');

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleId
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: roleId
    });
  } catch (err) {
    console.error('Create user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role').select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, getUsers };
