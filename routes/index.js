const express = require('express');
const router = express.Router();

/* Get home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
