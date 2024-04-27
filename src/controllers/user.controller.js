// src/controllers/userController.js
const db = require('../config/db.config');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    } 
    res.json(results);
  });
};
