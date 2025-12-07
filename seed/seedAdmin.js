require('dotenv').config();
require('module-alias/register');
const connectDB = require('@config/db');
const Permission = require('@models/Permission');
const Role = require('@models/Role');
const User = require('@models/User');

const permissionsData = [
  // Users
  { name: "user.browse", view: "User browse", group: "User" },
  { name: "user.create", view: "User Create", group: "User" },
  { name: "user.update", view: "User Update", group: "User" },
  { name: "user.delete", view: "User Delete", group: "User" },
  // Roles
  { name: "role.browse", view: "Role browse", group: "Role" },
  { name: "role.create", view: "Role Create", group: "Role" },
  { name: "role.update", view: "Role Update", group: "Role" },
  { name: "role.delete", view: "Role Delete", group: "Role" },
  // you can paste your full list here (department, inventory, MES, etc.)
  { name: "permission.browse", view: "Permission browse", group: "Permission" },
  { name: "mes.dashboard", view: "MES Dashboard", group: "MES" }
];

const seed = async () => {
  try {
    await connectDB();

    await Permission.deleteMany({});
    const createdPerms = await Permission.insertMany(permissionsData);
    console.log(`Created ${createdPerms.length} permissions`);

    await Role.deleteMany({});
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      key: 'super_admin',
      permissions: createdPerms.map((p) => p.name) // array of permission names
    });
    console.log('Created role:', superAdminRole.name);

    await User.deleteMany({});
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: superAdminRole._id
    });

    console.log('Created super admin user:', adminUser.email);
    console.log('Login with: admin@example.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
