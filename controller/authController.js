const User = require('@models/User');
const generateToken = require('@utils/generateToken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role._id,
          name: user.role.name,
          key: user.role.key,
          permissions: user.role.permissions
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).populate('role');
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: {
      id: user.role._id,
      name: user.role.name,
      key: user.role.key,
      permissions: user.role.permissions,
    },
  });
};