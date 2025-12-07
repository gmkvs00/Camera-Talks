const Role = require('@models/Role');

exports.createRole = async (req, res) => {
  try {
    const { name, key, permissions } = req.body;

    const existing = await Role.findOne({ key });
    if (existing) {
      return res.status(400).json({ message: 'Role key already exists' });
    }

    const role = await Role.create({
      name,
      key,
      permissions: permissions || []
    });

    res.status(201).json(role);
  } catch (err) {
    console.error('Create role error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    console.error('Get roles error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.rolesDataTable = async (req, res) => {
  try {
    const { draw, start = 0, length = 10, search } = req.query;

    const limit = parseInt(length, 10) || 10;
    const skip = parseInt(start, 10) || 0;

    // base query: all roles
    let query = {};

    // DataTables-style search: search.value
    if (search && search.value) {
      const searchValue = search.value.trim();
      if (searchValue) {
        query = {
          $or: [
            { name: { $regex: searchValue, $options: 'i' } },
            { key: { $regex: searchValue, $options: 'i' } },
          ],
        };
      }
    }

    const [data, recordsTotal, recordsFiltered] = await Promise.all([
      Role.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Role.countDocuments({}),     
      Role.countDocuments(query),
    ]);
    console.log(data);
    
    res.json({
      draw: parseInt(draw, 10) || 0,
      recordsTotal,
      recordsFiltered,
      data,
    });
  } catch (err) {
    console.error('rolesDataTable error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};