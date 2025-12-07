const express = require('express');
const router = express.Router();
const { loginUser } = require('@controller/authController');
const { createUser, getUsers } = require('../controller/userController');
const Role = require('@controller/roleController');
const { getPermissions } = require('@controller/permissionController');
const News = require('@controller/news.controller');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/auth/login', loginUser);

router.post('/users', protect, authorize(['user.create']), createUser);
router.get('/users', protect, authorize(['user.browse']), getUsers);

router.post('/roles', protect, authorize(['role.create']), Role.createRole);
router.get('/roles', protect, authorize(['role.browse']), Role.getRoles);

router.get('/permissions', protect, authorize(['permission.browse']), getPermissions);

router.get('/roles/datatable', protect, authorize(['role.browse']), Role.rolesDataTable);

router.post('/news', protect, authorize(['news.create']), News.createNews);
router.get( '/news/datatable', protect,authorize(['news.browse']),News.createNews);

module.exports = router;
