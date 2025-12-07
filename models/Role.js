const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // "Super Admin"
    key: { type: String, required: true, unique: true }, // "super_admin"
    permissions: [
      {
        type: String, // e.g. "user.browse", "mes.dashboard"
        required: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
