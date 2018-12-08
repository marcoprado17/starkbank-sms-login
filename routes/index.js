const express = require('express');
const router = express.Router();

/* Get home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
