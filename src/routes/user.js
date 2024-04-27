// src/routes/api.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/users', userController.getAllUsers);

module.exports = router;
