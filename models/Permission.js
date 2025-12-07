const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    // e.g. "user.browse"
    name: { type: String, required: true, unique: true },
    // e.g. "User browse"
    view: { type: String, required: true },
    // e.g. "User"
    group: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Permission', permissionSchema);
