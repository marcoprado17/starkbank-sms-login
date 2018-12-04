var express = require('express');
var router = express.Router();

/* Endpoint to register a new telephone */
router.post('/', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
