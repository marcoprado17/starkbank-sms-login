const express = require('express');
const router = express.Router();
const db = require('../database/db');

/* Endpoint to register a new user */
router.post('/', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
